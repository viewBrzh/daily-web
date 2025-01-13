const db = require('../util/db');

module.exports = class Project {
  constructor(projectId, title, lastUpdate, status) {
    this.projectId = projectId;
    this.title = title;
    this.lastUpdate = lastUpdate;
    this.status = status;
  }

  static async findAll() {
    try {
      const [results] = await db.execute('SELECT * FROM projects');
  
      return { results };
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      throw error;
    }
  }
  
  
};

