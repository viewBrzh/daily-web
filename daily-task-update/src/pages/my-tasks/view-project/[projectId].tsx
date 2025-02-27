import Layout from '@/components/layout/layout';
import styles from "@/styles/view-project/viewProject.module.css";
import PageContainer from '@/components/layout/pageContainer';
import { getViewProject } from '@/pages/api/my-task/project';
import { ViewProject, Member } from '@/components/common/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Overview from '@/views/view-project/overview';
import ProjectCalendar from '@/views/view-project/projectCalendar';
import { faBarsProgress, faCalendarDays, faChartPie, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectDashboard from '@/views/view-project/projectDashboard';
import SprintBoard from '@/views/view-project/sprintBoard';
import LoadingModal from '@/components/common/loadingModa';

const initialPageData = {
  project: {
    project_code: "",
    project_id: 0,
    name: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    status: "",
    updated: new Date(),
  },
  tasks: [
    {
      task_id: 0,
      name: "",
      description: "",
      status_id: 0,
      res_user_id: 0,
      sprint_id: 0,
      project_id: 0,
      res_user_full_name: "",
      priority: 0,
    }
  ],
  members: [
    {
      full_name: "",
      user_id: 0,
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
  const [activeTab, setActiveTab] = useState("Overview");

  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  // Run only on the client side to avoid localStorage error during SSR
  useEffect(() => {
    // Check if the router and projectId are ready
    if (!router.isReady || !projectId) return;

    // Fetch the project data when projectId is ready
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user_id = localStorage.getItem("user_id");
        const res = await getViewProject(projectId.toString(), parseInt(user_id || "0"));
        setPageData(res);
      } catch (error) {
        console.error('Error fetching project data:', error);
        alert("Error fetching project data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, projectId]);

  // Check if the component is mounted and if localStorage is available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // Redirect to login if no token
      } else {
        setAuthenticated(true); // Set authenticated to true if token exists
      }
    }
  }, [router]);

  // Show loading state while checking for authentication
  if (authenticated === false) {
    return <p>Loading...</p>; // Render loading message if not authenticated
  }

  return (
    <Layout>
      <PageContainer title={project.name}>
        {/* Tab bar */}
        <div className={styles.tabBar}>
          {tabs.map((tab, index) => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <FontAwesomeIcon className={styles.icon} icon={iconTabs[index]} /> {tab}
            </div>
          ))}
        </div>

        {/* Content containers based on active tab */}
        <div className={styles.contentContainer}>
          {activeTab === "Overview" && <Overview projectId={projectIdStr} projectData={project} memberData={members} />}
          {activeTab === "Calendar" && <ProjectCalendar projectId={projectIdStr} />}
          {activeTab === "Dashboard" && <ProjectDashboard projectId={projectIdStr} />}
          {activeTab === "Sprint" && <SprintBoard projectId={projectIdStr} />}
        </div>
      </PageContainer>
      <LoadingModal isLoading={isLoading} />
    </Layout>
  );
};

export default ViewProjectPage;
