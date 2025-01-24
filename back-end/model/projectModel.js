const db = require('../util/db');

module.exports = class Project {
  constructor(projectId, name, lastUpdate, status) {
    this.projectId = projectId;
    this.name = name;
    this.lastUpdate = lastUpdate;
    this.status = status;
  }

  static async findMyProject(resUserId) {
    try {
      const queryMytasks = `SELECT * FROM tasks WHERE resUserID = ${resUserId}`;
      const [myTasksDataResults] = await db.execute(queryMytasks);

      // Map project IDs from the first query
      const projectIds = myTasksDataResults.map(task => task.projectId);

      if (projectIds.length === 0) {
        return { message: 'No tasks found for this user.' };
      }

      const queryProjectData = `SELECT * FROM projects WHERE projectId IN (${projectIds.join(',')})`;
      const [projectDataResults] = await db.execute(queryProjectData);

      const mappedProjects = projectDataResults.map(project => ({
        projectId: project.projectId,
        projectCode: project.projectCode,
        name: project.name,
        description: project.description,
        startDate: project.start_date,
        endDate: project.end_date,
        lastUpdate: project.updated_at,
        status: project.status,
      }));

      const queryRole = `SELECT projectId, role FROM projectMembers WHERE userId = ${resUserId} AND projectId IN (${projectIds.join(',')})`;
      const [roleDataResults] = await db.execute(queryRole);

      const rolesByProject = roleDataResults.reduce((acc, role) => {
        acc[role.projectId] = role.role;
        return acc;
      }, {});

      const finalResults = mappedProjects.map(project => ({
        ...project,
        role: rolesByProject[project.projectId] || 'No role assigned',
      }));

      return { finalResults };
    } catch (error) {
      console.error('Error fetching tasks, projects, or roles:', error.message);
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

