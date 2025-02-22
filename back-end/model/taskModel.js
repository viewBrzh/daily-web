const db = require('../util/db');

module.exports = class Tasks {
  constructor(
    taskId,
    sprint,
    name,
    description,
    resUserId,
    projectId,
    startDate,
    endDate,
    priority,
    status,
  ) {
    this.taskId = taskId;
    this.sprint = sprint;
    this.name = name;
    this.description = description;
    this.resUserId = resUserId;
    this.projectId = projectId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.priority = priority;
    this.status = status;
  }

  static async getSprintByProject(projectId) {
    try {
      const [result] = await db.execute(
        "SELECT * FROM sprints WHERE projectId = ?",
        [projectId]
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async getCurrentSprint(projectId) {
    try {
      // Query for the current active sprint
      const currentSprintQuery = `
            SELECT * FROM sprints
            WHERE CURDATE() BETWEEN start_date AND end_date AND projectId = ?
            ORDER BY end_date DESC
            LIMIT 1;
        `;

      const [currentSprint] = await db.execute(currentSprintQuery, [projectId]);

      if (currentSprint.length > 0) {
        return currentSprint[0]; // Return the current sprint if found
      }

      // If no current sprint, find the closest one (past or future)
      const closestSprintQuery = `
            SELECT * FROM sprints
            WHERE projectId = ?
            ORDER BY ABS(DATEDIFF(start_date, CURDATE()))
            LIMIT 1;
        `;

      const [closestSprint] = await db.execute(closestSprintQuery, [projectId]);

      return closestSprint.length > 0 ? closestSprint[0] : null;
    } catch (err) {
      throw err;
    }
  }

  static async getPersonFilterOption(sprintId) {
    try {
      // If sprintId is null or undefined, set it to null explicitly
      if (sprintId == null) {
        sprintId = null; // Ensure that it's null instead of undefined
      }

      const personFilterQuery = `
            SELECT DISTINCT u.userId, u.username, u.fullName, u.empId
            FROM users u
            JOIN tasks ON tasks.resUserId = u.userId
            WHERE tasks.sprintId = ?;
        `;

      const [personFilter] = await db.execute(personFilterQuery, [sprintId]);

      // Return an empty array if no records are found
      return personFilter.length > 0 ? personFilter : [];
    } catch (err) {
      console.error("Error fetching person filter options:", err);
      throw err;
    }
  }



  static async getTask(sprintId, userId) {
    try {
      let query = `
        SELECT tasks.*, users.fullName AS resUserFullName
        FROM tasks
        LEFT JOIN users ON tasks.resUserId = users.userId
        WHERE tasks.sprintId = ?
      `;

      const params = [sprintId];
      if (userId !== 0) {
        query += " AND tasks.resUserId = ?";
        params.push(userId);
      }

      const [tasks] = await db.execute(query, params);

      return tasks;
    } catch (err) {
      throw err;
    }
  }


  static async getTaskStatus() {
    try {
      const query = `
            SELECT * FROM task_status ORDER BY statusId ASC;
        `;

      const [status] = await db.execute(query);

      return status;
    } catch (err) {
      throw err;
    }
  }

  static async updateTaskStatus(taskId, statusId) {
    try {
      const query = `
        UPDATE tasks 
        SET statusId = ? 
        WHERE taskId = ?;
      `;

      await db.execute(query, [statusId, taskId]);

      return { message: "Task status updated successfully" };
    } catch (err) {
      throw err;
    }
  }

  static async addNewSprint(start_date, end_date, sprintName, projectId) {
    try {
      const query = `
        INSERT INTO sprints (start_date, end_date, sprintName, projectId)
        VALUES (?, ?, ?, ?);
      `;

      await db.execute(query, [start_date, end_date, sprintName, projectId]);

      return { message: "Insert Sprint successfully: " + sprintName };
    } catch (err) {
      throw err;
    }
  }

  static async updateTask(taskId, name, description, resUserId, sprintId, projectId, statusId, priority) {
    try {
      const query = `
        UPDATE tasks 
        SET 
          name = ?, 
          description = ?, 
          resUserId = ?, 
          sprintId = ?, 
          projectId = ?, 
          statusId = ?, 
          priority = ?
        WHERE taskId = ?;
      `;

      const values = [name, description, resUserId, sprintId, projectId, statusId, priority, taskId];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  static async insertTask(newTask) {
    const query = `
        INSERT INTO tasks (name, description, resUserId, sprintId, projectId, statusId, priority) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    if (!newTask.name) {
      throw new Error('Task name is required');
    }

    const description = newTask.description && newTask.description.trim() ? newTask.description : null;

    const values = [
      newTask.name,
      description,
      newTask.resUserId || null,
      newTask.sprintId || null,
      newTask.projectId || null,
      newTask.statusId || 1,
      newTask.priority || null
    ];

    console.log("Inserting New Task Data:", values);

    try {
      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error inserting task:", error);
      throw new Error('Failed to insert task');
    }
  }

  static async deleteTask(taskId) {
    try {
      // Use the correct DELETE query format
      const query = `
            DELETE FROM tasks
            WHERE taskId = ?;
        `;

      const values = [taskId];

      const [result] = await db.execute(query, values);
      return result;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

};
