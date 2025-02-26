import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cthfnaaoskttzptrovht.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Dropdown {

    static async getUserDropdown(searchValue) {
        try {
            const limit = 5;

            let query = supabase
                .from('users')
                .select('userId, username, fullName, empId')
                .limit(limit);

            if (searchValue) {
                query = query.ilike('fullName', `%${searchValue}%`)
                    .or(`username.ilike.%${searchValue}%`);
            }

            const { data: finalResult, error } = await query;

            if (error) {
                throw new Error('Error fetching user dropdown: ' + error.message);
            }

            return { finalResult };
        } catch (err) {
            throw err;
        }
    }

    static async getUserDropdownByProject(projectId) {
        try {
            const limit = 5;

            const { data: finalResult, error } = await supabase
                .from('projectMembers')
                .select('userId, username, fullName, empId')
                .eq('projectId', projectId)
                .limit(limit)
                .join('users', 'userId', 'users.userId');  // Join with users table based on userId

            if (error) {
                throw new Error('Error fetching user dropdown by project: ' + error.message);
            }

            return { finalResult };
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
                .select('userId, username, fullName, empId')
                .eq('sprintId', sprintId)
                .join('users', 'userId', 'users.userId')
                .distinct();

            if (error) {
                console.error('Error fetching task filter dropdown:', error.message);
                throw error;
            }

            return rows.length > 0 ? rows : [];
        } catch (err) {
            console.error("Error fetching task filter dropdown:", err);
            throw err;
        }
    }

};
