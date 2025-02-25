const db = require('../util/db');

module.exports = class Project {
  constructor(projectId, name, lastUpdate, status) {
    this.projectId = projectId;
    this.name = name;
    this.lastUpdate = lastUpdate;
    this.status = status;
  }

  static async findMyProject(resUserId, searchValue, page, sortBy) {
    try {
      const itemPerPage = 6;
      const offset = (page - 1) * itemPerPage;

      // Query to fetch tasks for the user
      const memberQuery = `SELECT * FROM projectMembers WHERE userId = ${resUserId}`;
      const [memberResult] = await db.execute(memberQuery);

      // Map project IDs from the tasks
      const projectIds = memberResult.map(task => task.projectId);

      if (projectIds.length === 0) {
        return { message: "No tasks found for this user." };
      }

      // Build the WHERE clause to filter by name or code
      let filterConditions = `projectId IN (${projectIds.join(",")})`;
      if (searchValue) {
        filterConditions += ` AND (name LIKE '%${searchValue}%' OR projectCode LIKE '%${searchValue}%')`;
      }

      // Determine sort column based on input
      let sortOrder = 'ASC';
      let sortColumn;
      switch (sortBy) {
        case "name":
          sortColumn = "name";
          break;
        case "status":
          sortColumn = "status";
          break;
        case "last-updated":
        default:
          sortColumn = "updated_at";
          sortOrder = "DESC"
      }

      // Query to fetch the total count of projects that match the filter
      const queryProjectCount = `
        SELECT COUNT(*) AS totalProjects
        FROM projects 
        WHERE ${filterConditions}
      `;
      const [totalProjectsResult] = await db.execute(queryProjectCount);
      const totalProjects = totalProjectsResult[0].totalProjects;

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalProjects / itemPerPage);

      // Query to fetch projects with sorting, LIMIT, and OFFSET
      const queryProjectData = `
        SELECT * FROM projects 
        WHERE ${filterConditions} 
        ORDER BY ${sortColumn} ${sortOrder} 
        LIMIT ${itemPerPage} OFFSET ${offset}
      `;
      const [projectDataResults] = await db.execute(queryProjectData);

      if (projectDataResults.length === 0) {
        return { message: "No projects found with the given search criteria." };
      }

      // Map project data
      const mappedProjects = projectDataResults.map(project => ({
        projectId: project.projectId,
        projectCode: project.projectCode,
        name: project.name,
        description: project.description,
        startDate: formatDateToDDMMYYYY(project.start_date),
        endDate: formatDateToDDMMYYYY(project.end_date),
        lastUpdate: formatDate(project.updated_at),
        status: project.status,
      }));

      // Query to fetch roles for the user in the filtered projects
      const queryRole = `
        SELECT projectId, role 
        FROM projectMembers 
        WHERE userId = ${resUserId} 
        AND projectId IN (${projectIds.join(",")})
      `;
      const [roleDataResults] = await db.execute(queryRole);

      // Map roles by project ID
      const rolesByProject = roleDataResults.reduce((acc, role) => {
        acc[role.projectId] = role.role;
        return acc;
      }, {});

      // Combine project data with roles
      const finalResults = await Promise.all(
        mappedProjects.map(async (project) => {
          const queryMemberCount = `
            SELECT COUNT(*) AS memberCount 
            FROM projectMembers 
            WHERE projectId = ?
          `;
          const [memberCountResult] = await db.execute(queryMemberCount, [project.projectId]);

          const queryTaskCount = `
            SELECT COUNT(*) AS taskCount 
            FROM tasks 
            WHERE projectId = ?
          `;
          const [taskCountResult] = await db.execute(queryTaskCount, [project.projectId]);

          return {
            ...project,
            role: rolesByProject[project.projectId] || "-",
            members: memberCountResult[0]?.memberCount || 0,
            task: taskCountResult[0]?.taskCount || 0,
          };
        })
      );

      return { finalResults, totalPages, totalProjects };
    } catch (error) {
      console.error("Error fetching tasks, projects, or roles:", error.message);
      throw error;
    }
  }


  static async addProject(projectCode, name, description, start_date, end_date, member) {
    try {
      // Assuming you're using a database model or connection object
      const query = `INSERT INTO projects (projectCode, name, description, start_date, end_date) 
                       VALUES (?, ?, ?, ?, ?)`;

      // Assuming you have a DB connection or ORM, replace this with the actual query execution
      const [result] = await db.query(query, [projectCode, name, description, start_date, end_date]);

      console.log('Project added successfully:', projectCode, result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error adding Project Code:', projectCode, error.message);
      throw error;
    }
  }

  static async addMembers(projectId, members) {
    try {
      const query = `INSERT INTO projectMembers (projectId, userId, role) VALUES ?`;

      const values = members.map(member => [projectId, member.userId, member.role]);

      const [result] = await db.query(query, [values]);
      console.log(result)

      return result;
    } catch (error) {
      throw new Error('Error adding members: ' + error.message);
    }
  }

  static async getViewProject(projectId, userId) {
    try {
      const queryProject = `SELECT 
                              projectId,
                              projectCode,
                              name, 
                              description, 
                              DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
                              DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
                              status,
                              created_at, 
                              updated_at
                            FROM projects WHERE projectId = ${projectId}`;
      const queryMytasks = `SELECT * FROM tasks WHERE resUserId = ${userId} AND projectId = ${projectId}`;
      const queryMembers = `
        SELECT projectMembers.*, users.fullName 
        FROM projectMembers 
        JOIN users ON projectMembers.userId = users.userId 
        WHERE projectMembers.projectId = ${projectId}
      `;

      const [projectResult] = await db.query(queryProject);
      const mytasksResult = await db.query(queryMytasks);
      const projectMembers = await db.query(queryMembers);

      return { projectResult, mytasksResult, projectMembers };
    } catch (error) {
      throw new Error('Error adding members: ' + error.message);
    }
  }

  static async updateProject(projectId, projectCode, name, description, start_date, end_date, status) {
    try {
      const formattedStartDate = new Date(start_date).toISOString().slice(0, 19).replace("T", " ");
      const formattedEndDate = new Date(end_date).toISOString().slice(0, 19).replace("T", " ");

      const query = `
            UPDATE projects 
            SET projectCode = ?, \`name\` = ?, description = ?, start_date = ?, end_date = ?, status = ?
            WHERE projectId = ?
        `;

      const [result] = await db.query(query, [projectCode, name, description, formattedStartDate, formattedEndDate, status, projectId]);

      if (result.affectedRows === 0) {
        return { message: "Project not found or no changes made", projectId }
      }
      return { message: "Project updated successfully", projectId };
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  }

};

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
