const db = require('../util/db');

module.exports = class Mytasks {
  constructor(projectId, title, lastUpdate, status) {
    this.projectId = projectId;
    this.title = title;
    this.lastUpdate = lastUpdate;
    this.status = status;
  }

  static async findMyTasks() {
    try {
      const query = `SELECT * FROM projects`;
      const [results] = await db.execute(query);
  
      return { results };
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      throw error;
    }
  }
  
  
};

