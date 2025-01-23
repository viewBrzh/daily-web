const db = require('../util/db');

module.exports = class Mytasks {
  constructor(
    taskId,
    sprint,
    title,
    description,
    reproSteps,
    resUserId,
    projectId,
    dueDate,
    priority,
    state,
    iteration
  ) {
    this.taskId = taskId;
    this.sprint = sprint;
    this.title = title;
    this.description = description;
    this.reproSteps = reproSteps;
    this.resUserId = resUserId;
    this.projectId = projectId;
    this.dueDate = dueDate;
    this.priority = priority;
    this.state = state;
    this.iteration = iteration;
  }

  static async findMyTasks(resUserId) {
    try {
      // Step 1: Fetch tasks related to the user
      const queryMytasks = `SELECT projectId FROM tasks WHERE resUserId = ${resUserId}`;
      const [myTasksDataResults] = await db.execute(queryMytasks);

      // Map project IDs from the first query
      const projectIds = myTasksDataResults.map(task => task.projectId);

      if (projectIds.length === 0) {
        return { message: 'No tasks found for this user.' };
      }

      // Step 2: Fetch project data for the mapped project IDs
      const queryProjectData = `SELECT * FROM projects WHERE projectId IN (${projectIds.join(',')})`;
      const [projectDataResults] = await db.execute(queryProjectData);

      // Map project data to extract necessary fields
      const mappedProjects = projectDataResults.map(project => ({
        projectId: project.projectId,
        projectCode: project.projectCode,
        title: project.title,
        description: project.description,
        customer: project.customer,
        lastUpdate: project.lastUpdate,
        status: project.status,
      }));

      // Step 3: Fetch roles for the user in these projects
      const queryRole = `SELECT projectId, role FROM projectMembers WHERE userId = ${resUserId} AND projectId IN (${projectIds.join(',')})`;
      const [roleDataResults] = await db.execute(queryRole);

      // Map roles by projectId
      const rolesByProject = roleDataResults.reduce((acc, role) => {
        acc[role.projectId] = role.role;
        return acc;
      }, {});

      // Combine project data with roles
      const finalResults = mappedProjects.map(project => ({
        ...project,
        role: rolesByProject[project.projectId] || 'No role assigned',
      }));

      return {finalResults};
    } catch (error) {
      console.error('Error fetching tasks, projects, or roles:', error.message);
      throw error;
    }
  }
};
