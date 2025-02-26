import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cthfnaaoskttzptrovht.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Dashboard {

    static async getProjectDashboard(projectId) {
        try {
            // Query for task status count
            const { data: taskStatus, error: taskStatusError } = await supabase
                .from('tasks')
                .select('statusId, count(taskId)')
                .eq('projectId', projectId)
                .group('statusId')
                .join('task_status', 'tasks.statusId', 'task_status.statusId')
                .select('task_status.name, count(taskId)')
                .group('task_status.name');

            if (taskStatusError) throw new Error('Error fetching task status count: ' + taskStatusError.message);

            // Query for sprint progress dynamically
            const { data: sprintProgress, error: sprintProgressError } = await supabase
                .from('sprints')
                .select('sprintName, count(taskId) AS totalTasks, json_agg(task_status.name) AS statusCount')
                .eq('projectId', projectId)
                .leftJoin('tasks', 'sprints.sprintId', 'tasks.sprintId')
                .leftJoin('task_status', 'tasks.statusId', 'task_status.statusId')
                .group('sprints.sprintId, task_status.name');

            if (sprintProgressError) throw new Error('Error fetching sprint progress: ' + sprintProgressError.message);

            // Parse the statusCount JSON string into a proper object
            sprintProgress.forEach(sprint => {
                if (sprint.statusCount) {
                    sprint.statusCount = JSON.parse(sprint.statusCount);
                }
            });

            // Query for project member count
            const { data: members, error: memberError } = await supabase
                .from('projectMembers')
                .select('role, count(*) AS count')
                .eq('projectId', projectId)
                .group('role');

            if (memberError) throw new Error('Error fetching project member count: ' + memberError.message);

            return { taskStatus, sprintProgress, members };

        } catch (err) {
            console.log('Error:', err);
            throw err;
        }
    }
};
