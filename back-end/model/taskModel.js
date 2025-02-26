import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cthfnaaoskttzptrovht.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    status
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
      const { data, error } = await supabase
        .from('sprints')
        .select('sprintId, start_date, end_date, sprintName, projectId')
        .eq('projectId', projectId);
      
      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async getCurrentSprint(projectId) {
    try {
      const { data: currentSprint, error } = await supabase
        .from('sprints')
        .select('sprintId, start_date, end_date, sprintName, projectId')
        .eq('projectId', projectId)
        .gt('start_date', new Date())
        .order('start_date', { ascending: true })
        .limit(1);
      
      if (error) throw error;
      if (currentSprint.length > 0) {
        return currentSprint[0];
      }

      // If no current sprint, get the closest future sprint
      const { data: closestSprint, error: closestError } = await supabase
        .from('sprints')
        .select('sprintId, start_date, end_date, sprintName, projectId')
        .eq('projectId', projectId)
        .order('start_date', { ascending: true })
        .limit(1);
      
      if (closestError) throw closestError;
      return closestSprint.length > 0 ? closestSprint[0] : null;
    } catch (err) {
      throw err;
    }
  }

  static async getPersonFilterOption(sprintId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('userId, username, fullName, empId')
        .join('tasks', 'tasks.resUserId', 'users.userId')
        .eq('tasks.sprintId', sprintId);

      if (error) throw error;
      return data.length > 0 ? data : [];
    } catch (err) {
      console.error("Error fetching person filter options:", err);
      throw err;
    }
  }

  static async getTask(sprintId, userId) {
    try {
      let query = supabase
        .from('tasks')
        .select('tasks.*, users.fullName AS resUserFullName')
        .eq('tasks.sprintId', sprintId)
        .leftJoin('users', 'tasks.resUserId', 'users.userId');
      
      if (userId !== 0) {
        query = query.eq('tasks.resUserId', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async getTaskStatus() {
    try {
      const { data, error } = await supabase
        .from('task_status')
        .select('*')
        .order('statusId', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async updateTaskStatus(taskId, statusId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ statusId })
        .eq('taskId', taskId);

      if (error) throw error;
      return { message: "Task status updated successfully" };
    } catch (err) {
      throw err;
    }
  }

  static async addNewSprint(start_date, end_date, sprintName, projectId) {
    try {
      const { data, error } = await supabase
        .from('sprints')
        .insert([{ start_date, end_date, sprintName, projectId }]);

      if (error) throw error;
      return { message: "Insert Sprint successfully: " + sprintName };
    } catch (err) {
      throw err;
    }
  }

  static async updateSprint(sprintId, start_date, end_date, sprintName) {
    try {
      const { data, error } = await supabase
        .from('sprints')
        .update({ start_date, end_date, sprintName })
        .eq('sprintId', sprintId);

      if (error) throw error;
      return { message: "Updated Sprint successfully: " + sprintName };
    } catch (err) {
      throw err;
    }
  }

  static async updateTask(taskId, name, description, resUserId, sprintId, projectId, statusId, priority) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ name, description, resUserId, sprintId, projectId, statusId, priority })
        .eq('taskId', taskId);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  }

  static async insertTask(newTask) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error inserting task:", err);
      throw new Error('Failed to insert task');
    }
  }

  static async deleteTask(taskId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('taskId', taskId);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  }
};