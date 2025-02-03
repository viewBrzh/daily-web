import Layout from '@/components/layout/layout';
import PageContainer from '@/components/layout/pageContainer';
import { getViewProject } from '@/pages/api/my-task/project';
import { ViewProject, Task, Member } from '@/views/my-tasks/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const initialPageData = {
  project: {
    projectCode: "",
    projectId: 0,
    name: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    status: "",
    lastUpdate: new Date(),
  },
  tasks: [
    {
      taskId: 0,
      name: "",
      description: "",
      status: "",
      resUserId: 0,
      sprintId: 0,
      projectId: 0,
    }
  ],
  members: [
    {
      fullName: "",
      userId: 0,
      role: "",
    }
  ],
};

const ViewProjectPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [pageData, setPageData] = useState(initialPageData);
  const [project, setProject] = useState<ViewProject>(pageData.project);
  const [members, setMembers] = useState<Member[]>(pageData.members);
  const [tasks, setTasks] = useState<Task[]>(pageData.tasks);

  useEffect(() => {
    if (!router.isReady || !projectId) return;

    const fetchData = async () => {
      try {
        const res = await getViewProject(projectId, 1);
        console.log(res);
        setPageData(await res);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchData();
  }, [router.isReady, projectId]);

  useEffect(() => {
    setProject(pageData.project);
    setMembers(pageData.members);
    setTasks(pageData.tasks);
  }, [pageData]);

  return (
    <Layout>
      <PageContainer title={project.name}>
        <></>
      </PageContainer>
    </Layout>
  );
};

export default ViewProjectPage;
