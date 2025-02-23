import Layout from '@/components/layout/layout';
import styles from "@/styles/view-project/viewProject.module.css";
import PageContainer from '@/components/layout/pageContainer';
import { getViewProject } from '@/pages/api/my-task/project';
import { ViewProject, Task, Member } from '@/components/common/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Overview from '@/views/view-project/overview';
import ProjectCalendar from '@/views/view-project/projectCalendar';
import { faArrowsTurnToDots, faBarsProgress, faCalendarDays, faChartPie, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectDashboard from '@/views/view-project/projectDashboard';
import SprintBoard from '@/views/view-project/sprintBoard';

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
      statusId: 0,
      resUserId: 0,
      sprintId: 0,
      projectId: 0,
      resUserFullName: "",
      priority: 0,
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

const iconTabs = [faBarsProgress, faChartPie, faTachometerAlt, faCalendarDays];

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

  const [authenticated, setAuthenticated] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, []);

  // ✅ Instead of returning early, show loading conditionally
  if (authenticated === null) {
    return <p>Loading...</p>;
  }

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
          <SprintBoard isSprint={activeTab} projectId={projectIdStr} />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ViewProjectPage;
