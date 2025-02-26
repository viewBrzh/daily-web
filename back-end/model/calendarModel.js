import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cthfnaaoskttzptrovht.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
    console.warn("Warning: SUPABASE_KEY is not defined. Check your environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Calendar {
    static async getAllCalendar(projectId, month) {
        try {
            // Ensure the month is valid (between 1 and 12)
            if (!month || month < 1 || month > 12) {
                throw new Error('Invalid month provided');
            }
    
            // Get the current year
            const year = new Date().getFullYear();
    
            // Build the start date for the given month
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    
            // Get the last day of the month
            const lastDay = new Date(year, month, 0).getDate(); // This will return the last valid day of the month
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    
            // Fetch calendar events using Supabase
            const { data, error } = await supabase
                .from('calendar')
                .select('id, title, description, location, date, created_by')
                .eq('project_id', projectId) // Filter by projectId
                .gte('date', startDate) // Filter by start date (>=)
                .lt('date', endDate) // Filter by end date (<)
    
            if (error) throw new Error(error.message);
    
            // Fetch user details (created_by) using another Supabase query
            const userIds = data.map(event => event.created_by); // Extract user IDs from the events
            const { data: users, error: userError } = await supabase
                .from('users')
                .select('user_id, full_name')
                .in('user_id', userIds); // Get all users who created the events
    
            if (userError) throw new Error(userError.message);
    
            // Map the calendar events and add the corresponding user information
            const result = data.map(event => {
                const user = users.find(user => user.user_id === event.created_by);
                return {
                    ...event,
                    created_by: user ? user.full_name : 'Unknown', // Add user fullName to created_by
                };
            });
    
            return { result };
        } catch (err) {
            console.error('Error fetching calendar events:', err);
            throw err; // Re-throw the error after logging it
        }
    }      

    static async getCalendarByDate(projectId, date) {
        try {
            if (!projectId || !date) {
                throw new Error("Both projectId and date are required");
            }
    
            // Fetch calendar events and include user details
            const { data: result, error } = await supabase
                .from('calendar')
                .select(`
                    id, title, description, location, date, created_by,
                    users (full_name, email)
                `) // Use correct foreign key reference
                .eq('project_id', projectId)
                .eq('date', date);
    
            if (error) throw new Error(error.message);
    
            return result;
        } catch (err) {
            console.error('Error fetching calendar by date:', err.message);
            throw new Error("Error fetching calendar by date: " + err.message);
        }
    }
    

    static async addCalendar(projectId, title, description, location, date, createdBy) {
        try {
            if (!projectId || !title || !date || !createdBy) {
                throw new Error("Missing required fields: projectId, title, date, createdBy");
            }

            // Insert a new calendar event
            const { data: result, error } = await supabase
                .from('calendar')
                .insert([{ project_id: projectId, title, description, location, date, created_by: createdBy }]);

            if (error) throw new Error(error.message);

            return result;
        } catch (err) {
            console.error('Error adding calendar event:', err.message);
            throw new Error("Error adding calendar event: " + err.message);
        }
    }

    static async deleteCalendar(id) {
        try {
            if (!id) {
                throw new Error("Calendar event ID is required");
            }

            // Delete a calendar event by id
            const { data: result, error } = await supabase
                .from('calendar')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);

            return result;
        } catch (err) {
            console.error('Error deleting calendar event:', err.message);
            throw new Error("Error deleting calendar event: " + err.message);
        }
    }
};
