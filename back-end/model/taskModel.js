import { createClient } from '@supabase/supabase-js';

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Tasks {

  static async getSprintByProject(project_id) {
    try {
      const { data, error } = await supabase
        .from('sprints')
        .select('sprint_id, start_date, end_date, sprint_name, project_id')
        .eq('project_id', project_id);

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async getCurrentSprint(project_id) {
    try {
      const { data: current_sprint, error } = await supabase
        .from('sprints')
        .select('sprint_id, start_date, end_date, sprint_name, project_id')
        .eq('project_id', project_id)
        .gt('start_date', new Date().toISOString().split('T')[0]) // FIXED DATE FORMAT
        .order('start_date', { ascending: true })
        .limit(1);

      if (error) throw error;
      if (current_sprint.length > 0) {
        return current_sprint[0];
      }

      const { data: closest_sprint, error: closest_error } = await supabase
        .from('sprints')
        .select('sprint_id, start_date, end_date, sprint_name, project_id')
        .eq('project_id', project_id)
        .order('start_date', { ascending: true })
        .limit(1);

      if (closest_error) throw closest_error;
      return closest_sprint.length > 0 ? closest_sprint[0] : null;
    } catch (err) {
      throw err;
    }
  }

  static async getPersonFilterOption(sprint_id) {
    try {
      // Fetch tasks to get res_user_ids
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('res_user_id')
        .eq('sprint_id', sprint_id);

      if (tasksError) throw tasksError;

      // Extract unique user IDs, excluding null values
      const userIds = [...new Set(tasks.map(task => task.res_user_id).filter(id => id !== null))];

      if (userIds.length === 0) {
        return []; // No valid user IDs, return empty array
      }

      // Fetch user details for valid user IDs
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('user_id, email, full_name, emp_id')
        .in('user_id', userIds);

      if (usersError) throw usersError;

      return users || [];
    } catch (err) {
      console.error("Error fetching person filter options:", err);
      throw err;
    }
  }

  static async getTask(sprint_id, user_id) {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('sprint_id', sprint_id);

      if (user_id !== 0) {
        query = query.eq('res_user_id', user_id);
      }

      const { data: tasks, error: tasksError } = await query;
      if (tasksError) throw tasksError;

      let users = [];

      if (tasks.length > 0) {
        // Get unique user IDs, excluding null values
        const userIds = [...new Set(tasks.map(task => task.res_user_id).filter(id => id !== null))];

        if (userIds.length > 0) {
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('user_id, full_name')
            .in('user_id', userIds);

          if (usersError) throw usersError;
          users = usersData || [];
        }
      }

      const tasksWithUserNames = tasks.map(task => {
        if (task.res_user_id === null) {
          return { ...task, res_user_full_name: null };  // Handle null case explicitly
        }

        const user = users.find(u => u.user_id === task.res_user_id);
        return {
          ...task,
          res_user_full_name: user ? user.full_name : null,
        };
      });

      return tasksWithUserNames;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      throw err;
    }
  }

  static async getTaskStatus() {
    try {
      const { data, error } = await supabase
        .from('task_status')
        .select('*')
        .order('status_id', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async updateTaskStatus(task_id, status_id) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status_id })
        .eq('task_id', task_id);

      if (error) throw error;
      return { message: "Task status updated successfully" };
    } catch (err) {
      throw err;
    }
  }

  static async addNewSprint(start_date, end_date, sprint_name, project_id) {
    try {
      const { data, error } = await supabase
        .from('sprints')
        .insert([{ start_date, end_date, sprint_name, project_id }]);

      if (error) throw error;
      return { message: "Insert Sprint successfully: " + sprint_name };
    } catch (err) {
      throw err;
    }
  }

  static async updateSprint(sprint_id, start_date, end_date, sprint_name) {
    try {
      const { data, error } = await supabase
        .from('sprints')
        .update({ start_date, end_date, sprint_name })
        .eq('sprint_id', sprint_id);

      if (error) throw error;
      return { message: "Updated Sprint successfully: " + sprint_name };
    } catch (err) {
      throw err;
    }
  }

  static async updateTask(task_id, name, description, res_user_id, sprint_id, project_id, status_id, priority) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ name, description, res_user_id, sprint_id, project_id, status_id, priority })
        .eq('task_id', task_id);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  }

  static async insertTask(new_task) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([new_task]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error inserting task:", err);
      throw new Error('Failed to insert task');
    }
  }

  static async deleteTask(task_id) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', task_id);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  }
};
