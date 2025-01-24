const db = require('../util/db');

module.exports = class Mytasks {
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

  
};
