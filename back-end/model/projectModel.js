import { createClient } from '@supabase/supabase-js';

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

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
      const { data: memberResult, error: memberError } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', resUserId);

      if (memberError) throw new Error('Error fetching member tasks: ' + memberError.message);

      // Map project IDs from the tasks
      const projectIds = memberResult.map(task => task.project_id);

      if (projectIds.length === 0) {
        return { message: "No tasks found for this user." };
      }

      // Build the WHERE clause to filter by name or code
      let filterConditions = `project_id IN (${projectIds.join(",")})`;
      if (searchValue) {
        filterConditions += ` AND (name ILIKE '%${searchValue}%' OR project_code ILIKE '%${searchValue}%')`;
      }

      // Determine sort column based on input
      let sortOrder = 'asc';
      let sortColumn = 'updated_at';
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
          sortOrder = "desc";
      }

      // Query to fetch the total count of projects that match the filter
      const { count: totalProjects, error: totalProjectsError } = await supabase
        .from('projects')
        .select('project_id', { count: 'exact' })
        .in('project_id', projectIds)
        .ilike('name', `%${searchValue}%`);

      if (totalProjectsError) throw new Error('Error fetching project count: ' + totalProjectsError.message);

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalProjects / itemPerPage);

      // Query to fetch projects with sorting, LIMIT, and OFFSET
      const { data: projectDataResults, error: projectDataError } = await supabase
        .from('projects')
        .select('*')
        .in('project_id', projectIds)
        .ilike('name', `%${searchValue}%`)
        .order(sortColumn, { ascending: sortOrder === 'asc' })
        .range(offset, offset + itemPerPage - 1);

      if (projectDataError) throw new Error('Error fetching project data: ' + projectDataError.message);

      if (projectDataResults.length === 0) {
        return { message: "No projects found with the given search criteria." };
      }

      // Map project data
      const mappedProjects = projectDataResults.map(project => ({
        project_id: project.project_id,
        project_code: project.project_code,
        name: project.name,
        description: project.description,
        start_date: formatDateToDDMMYYYY(project.start_date),
        end_date: formatDateToDDMMYYYY(project.end_date),
        updated: formatDate(project.updated_at),
        status: project.status,
      }));

      // Query to fetch roles for the user in the filtered projects
      const { data: roleDataResults, error: roleDataError } = await supabase
        .from('project_members')
        .select('project_id, role')
        .eq('user_id', resUserId)
        .in('project_id', projectIds);

      if (roleDataError) throw new Error('Error fetching role data: ' + roleDataError.message);

      // Map roles by project ID
      const rolesByProject = roleDataResults.reduce((acc, role) => {
        acc[role.project_id] = role.role;
        return acc;
      }, {});

      const finalResults = await Promise.all(
        mappedProjects.map(async (project) => {
          // Query for member count
          const { count: memberCount, error: memberCountError } = await supabase
            .from('project_members')
            .select('user_id', { count: 'exact' })
            .eq('project_id', project.project_id);  // Fix here
      
          if (memberCountError) throw new Error('Error fetching member count: ' + memberCountError.message);
      
          // Query for task count
          const { count: taskCount, error: taskCountError } = await supabase
            .from('tasks')
            .select('task_id', { count: 'exact' })
            .eq('project_id', project.project_id);  // Fix here
      
          if (taskCountError) throw new Error('Error fetching task count: ' + taskCountError.message);
      
          return {
            ...project,
            role: rolesByProject[project.project_id] || "-",
            members: memberCount || 0,
            task: taskCount || 0,
          };
        })
      );      

      return { finalResults, totalPages, totalProjects };
    } catch (error) {
      console.error("Error fetching tasks, projects, or roles:", error.message);
      throw error;
    }
  }

  static async addProject(projectCode, name, description, start_date, end_date) {
    try {
    
      const { data, error } = await supabase
        .from('projects')
        .insert([{ project_code: projectCode, name, description, start_date, end_date }])
        .select();
  
      if (error) {
        throw new Error(error.message);
      }
  
      const projectId = data[0].project_id; // Make sure this is a valid integer
  
      console.log('Project added successfully:', projectCode, projectId);
      return projectId;  // Return the project ID
    } catch (error) {
      console.error('Error adding project:', error.message);
      return { message: 'Failed to add new project', error: error.message };
    }
  }

  static async addMembers(projectId, members) {
    try {
      // Log projectId to ensure it is correct
      console.log('Project ID:', projectId);  // Debugging line
  
      // First, check if the project exists
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('project_id')
        .eq('project_id', projectId);
  
      if (projectError) {
        throw new Error('Error checking project: ' + projectError.message);
      }
  
      if (projectData.length === 0) {
        throw new Error(`Project with ID ${projectId} does not exist.`);
      }
  
      // Now check if the users exist
      const userIds = members.map(member => member.user_id);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .in('user_id', userIds);
  
      if (userError) {
        throw new Error('Error checking users: ' + userError.message);
      }
  
      if (userData.length !== userIds.length) {
        throw new Error('One or more users do not exist.');
      }
  
      // If both project and users exist, insert members
      const memberInsertData = members.map(member => ({
        project_id: projectId,
        user_id: member.user_id,
        role: member.role,
      }));
  
      const { data, error } = await supabase
        .from('project_members')
        .insert(memberInsertData)
        .select();
  
      if (error) {
        throw new Error('Error adding members: ' + error.message);
      }
  
      console.log('Members added successfully:', data);
      return data; // Return the added members data
    } catch (error) {
      console.error('Error adding members:', error.message);
      throw new Error('Error adding members: ' + error.message);
    }
  }  
  
  static async getViewProject(projectId, userId) {
    try {
      if (!projectId || !userId) {
        throw new Error("projectId and userId are required");
      }

      console.log("Fetching project details for:", { projectId, userId });

      // Fetch the project details
      const { data: projectResult, error: projectError } = await supabase
        .from('projects')
        .select('project_id, project_code, name, description, start_date, end_date, status, created_at, updated_at')
        .eq('project_id', projectId);

      if (projectError) throw new Error(projectError.message);

      if (!projectResult || projectResult.length === 0) {
        return { message: 'Project not found' };
      }

      // Fetch the tasks related to the user for the given project
      const { data: mytasksResult, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('res_user_id', userId)
        .eq('project_id', projectId);

      if (tasksError) throw new Error(tasksError.message);

      // Fetch all members for the project
      const { data: projectMembers, error: membersError } = await supabase
        .from('project_members')
        .select('user_id, role, user_id, users(full_name')
        .eq('project_id', projectId);

      if (membersError) throw new Error(membersError.message);

      return {
        projectResult: projectResult[0],
        mytasksResult: mytasksResult || [],
        projectMembers: projectMembers || []
      };

    } catch (error) {
      console.error("Error fetching project details:", error.message);
      throw new Error('Error fetching project details: ' + error.message);
    }
  }

  static async updateProject(projectId, projectCode, name, description, start_date, end_date, status) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ project_code: projectCode, name, description, start_date, end_date, status })
        .eq('project_id', projectId);

      if (error) {
        return { message: "Error updating project", projectId };
      }

      return { message: "Project updated successfully", projectId };
    } catch (error) {
      console.error("Error updating project:", error.message);
      throw error;
    }
  }

  static async getAllProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*'); // Select all columns

      if (error) {
        return { message: "Error fetching projects", error };
      }

      return { message: "Projects fetched successfully", data };
    } catch (error) {
      console.error("Error fetching projects:", error.message);
      throw error;
    }
  }
};

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
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


