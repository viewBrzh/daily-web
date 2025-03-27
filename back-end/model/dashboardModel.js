const { createClient } = require('@supabase/supabase-js');

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);


module.exports = class Dashboard {
    static async getProjectDashboard(projectId) {
        try {
            console.log(`Fetching dashboard for project: ${projectId}`);

            const { data: taskStatus, error: taskStatusError } = await supabase
                .from('tasks')
                .select('status_id, task_status(name)')
                .eq('project_id', projectId);

            if (taskStatusError) {
                throw new Error('Error fetching task status count: ' + taskStatusError.message);
            }

            const taskStatusCount = {};
            taskStatus.forEach(task => {
                const statusName = task.task_status?.name || 'Unknown';
                taskStatusCount[statusName] = (taskStatusCount[statusName] || 0) + 1;
            });

            const { data: sprintData, error: sprintError } = await supabase
                .from('sprints')
                .select('sprint_name, tasks(status_id, task_status(name))')
                .eq('project_id', projectId);

            if (sprintError) {
                throw new Error('Error fetching sprint progress: ' + sprintError.message);
            }

            const sprintProgress = sprintData.map(sprint => {
                const statusCount = {};
                sprint.tasks?.forEach(task => {
                    const statusName = task.task_status?.name || 'Unknown';
                    statusCount[statusName] = (statusCount[statusName] || 0) + 1;
                });
                return {
                    sprint_name: sprint.sprint_name,
                    total_tasks: sprint.tasks?.length || 0,
                    status_count: statusCount,
                };
            });

            const { data: members, error: memberError } = await supabase
                .from('project_members')
                .select('role')
                .eq('project_id', projectId);

            if (memberError) {
                throw new Error('Error fetching project member count: ' + memberError.message);
            }

            const memberCount = {};
            members.forEach(member => {
                const role = member.role || 'Unknown';
                memberCount[role] = (memberCount[role] || 0) + 1;
            });

            return {
                task_status: taskStatusCount,
                sprint_progress: sprintProgress,
                members: memberCount,
            };

        } catch (err) {
            console.error('Error:', err.message);
            throw err;
        }
    }
}
