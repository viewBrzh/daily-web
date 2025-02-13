import Layout from '@/components/layout/layout';
import styles from "@/styles/view-project/viewProject.module.css";
import PageContainer from '@/components/layout/pageContainer';
import { getViewProject } from '@/pages/api/my-task/project';
import { ViewProject, Task, Member } from '@/components/common/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Overview from '@/views/view-project/overview';
import ProjectCalendar from '@/views/view-project/projectCalendar';
import { faArrowsTurnToDots, faBarsProgress, faCalendarDays, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DashboardCharts from '@/components/common/chart/dashboardCharts';
import ProjectDashboard from '@/views/view-project/projectDashboard';

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

const iconTabs = [faBarsProgress, faChartPie, faArrowsTurnToDots, faCalendarDays];

const tabs = ["Overview", "Dashboard", "Sprint", "Calendar"];

const ViewProjectPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const projectIdStr = Array.isArray(projectId) ? projectId.join("") : projectId ?? "0";
  const [pageData, setPageData] = useState(initialPageData);
  const [project, setProject] = useState<ViewProject>(pageData.project);
  const [members, setMembers] = useState<Member[]>(pageData.members);
  const [tasks, setTasks] = useState<Task[]>(pageData.tasks);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (!router.isReady || !projectId) return;


    const fetchData = async () => {
      try {
        const res = await getViewProject(projectId, 1);
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
        <div className={styles.tabBar}>
          {tabs.map((tab, index) => (
            <div 
              key={tab} 
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <FontAwesomeIcon className={styles.icon} icon={iconTabs[index]} />  {tab}
            </div>
          ))}
        </div>
        <div className={styles.contentContainer}>
          <Overview projectData={project} memberData={members} isOverview={activeTab} projectId={projectIdStr} />
          <ProjectCalendar isCalendar={activeTab} projectId={projectIdStr} />
          <ProjectDashboard isDashboard={activeTab} projectId={projectIdStr} />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ViewProjectPage;
