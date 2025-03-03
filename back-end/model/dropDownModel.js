import { createClient } from '@supabase/supabase-js';

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Dropdown {

    static async getUserDropdown(searchValue) {
        try {
            const limit = 5;

            let query = supabase
                .from('users')
                .select('user_id, email, full_name, emp_id')
                .limit(limit);

            if (searchValue) {
                query = query.ilike('full_name', `%${searchValue}%`)
            }

            const { data: finalResult, error } = await query;

            if (error) {
                throw new Error('Error fetching user dropdown: ' + error.message);
            }

            return  finalResult;
        } catch (err) {
            throw err;
        }
    }

    static async getUserDropdownByProject(projectId) {
        try {
            const limit = 5;
    
            const { data: finalResult, error } = await supabase
                .from('project_members')
                .select('user_id, users(email, full_name, emp_id)') // Use relationship format
                .eq('project_id', projectId)
                .limit(limit);
    
            if (error) {
                throw new Error('Error fetching user dropdown by project: ' + error.message);
            }
    
            // Restructure the data
            const formattedResult = finalResult.map(member => ({
                user_id: member.user_id,
                email: member.users?.email || null,
                full_name: member.users?.full_name || null,
                emp_id: member.users?.emp_id || null
            }));
    
            return { finalResult: formattedResult };
        } catch (err) {
            throw err;
        }
    }
    

    static async getTaskFilterDropdown(sprintId) {
        try {
            // If sprintId is null or undefined, return an empty array immediately
            if (!sprintId) {
                return [];
            }
    
            const { data: rows, error } = await supabase
                .from('tasks')
                .select('res_user_id, users(email, full_name, emp_id)')
                .eq('sprint_id', sprintId);
    
            if (error) {
                console.error('Error fetching task filter dropdown:', error.message);
                throw error;
            }
    
            // Restructure the data to include user details at the top level
            const formattedRows = rows.map(task => ({
                user_id: task.res_user_id,
                email: task.users?.email || null,
                full_name: task.users?.full_name || null,
                emp_id: task.users?.emp_id || null
            }));
    
            return formattedRows;
    
        } catch (err) {
            console.error("Error fetching task filter dropdown:", err);
            throw err;
        }
    }

};
