const db = require('../util/db');

module.exports = class Project {
  constructor(projectId, name, lastUpdate, status) {
    this.projectId = projectId;
    this.name = name;
    this.lastUpdate = lastUpdate;
    this.status = status;
  }

  static async findMyProject(resUserId, searchValue) {
    try {
      // Query to fetch tasks for the user
      const queryMytasks = `SELECT * FROM tasks WHERE resUserID = ${resUserId}`;
      const [myTasksDataResults] = await db.execute(queryMytasks);
  
      // Map project IDs from the tasks
      const projectIds = myTasksDataResults.map(task => task.projectId);
  
      if (projectIds.length === 0) {
        return { message: "No tasks found for this user." };
      }
  
      // Build the WHERE clause to filter by name or code
      let filterConditions = `projectId IN (${projectIds.join(",")})`;
      if (searchValue) {
        filterConditions += ` AND (name LIKE '%${searchValue}%' OR projectCode LIKE '%${searchValue}%')`;
      }
  
      // Query to fetch projects that match the filter
      const queryProjectData = `
        SELECT * FROM projects 
        WHERE ${filterConditions}
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
        lastUpdate: formatDateToDDMMYYYY(project.updated_at),
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

      const queryMember = `
        COUNT projectId IN projectId = ${resUserId}
        `;
  
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
            members: memberCountResult[0]?.memberCount || 0, // Include member count
            task: taskCountResult[0]?.taskCount || 0,
          };
        })
      );
  
      return { finalResults };
    } catch (error) {
      console.error("Error fetching tasks, projects, or roles:", error.message);
      throw error;
    }
  }  

  static async addProject(projectCode, name, description, start_date, end_date) {
    try {
      // Assuming you're using a database model or connection object
      const query = `INSERT INTO projects (projectCode, name, description, start_date, end_date) 
                       VALUES (?, ?, ?, ?, ?)`;

      // Assuming you have a DB connection or ORM, replace this with the actual query execution
      await db.query(query, [projectCode, name, description, start_date, end_date]);

      console.log('Project added successfully:', projectCode);
    } catch (error) {
      console.error('Error adding Project Code:', projectCode, error.message);
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