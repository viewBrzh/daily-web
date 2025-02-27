import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cthfnaaoskttzptrovht.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = class Dashboard {
    static async getProjectDashboard(projectId) {
        try {
            console.log(`Fetching dashboard for project: ${projectId}`);

            const { data: taskStatus, error: taskStatusError } = await supabase
                .from('tasks')
                .select('status_id, task_status(name)')
                .eq('project_id', projectId);

            if (taskStatusError) throw new Error('Error fetching task status count: ' + taskStatusError.message);

            const taskStatusCount = {};
            taskStatus.forEach(task => {
                const statusName = task.task_status?.name || 'Unknown';
                taskStatusCount[statusName] = (taskStatusCount[statusName] || 0) + 1;
            });

            const { data: sprintData, error: sprintError } = await supabase
                .from('sprints')
                .select('sprint_name, tasks(status_id, task_status(name))')
                .eq('project_id', projectId);

            if (sprintError) throw new Error('Error fetching sprint progress: ' + sprintError.message);

            const sprintProgress = sprintData.map(sprint => {
                const statusCount = {};
                if (sprint.tasks) {
                    sprint.tasks.forEach(task => {
                        const statusName = task.task_status?.name || 'Unknown';
                        statusCount[statusName] = (statusCount[statusName] || 0) + 1;
                    });
                }
                return {
                    sprintName: sprint.sprint_name,
                    totalTasks: sprint.tasks?.length || 0,
                    statusCount
                };
            });

            const { data: members, error: memberError } = await supabase
                .from('project_members')
                .select('role')
                .eq('project_id', projectId);

            if (memberError) throw new Error('Error fetching project member count: ' + memberError.message);

            const memberCount = {};
            members.forEach(member => {
                const role = member.role || 'Unknown';
                memberCount[role] = (memberCount[role] || 0) + 1;
            });

            return { taskStatus: taskStatusCount, sprintProgress, members: memberCount };

        } catch (err) {
            console.error('Error:', err.message);
            throw err;
        }
    }
};
