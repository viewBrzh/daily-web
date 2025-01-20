import Layout from '@/components/layout/layout';
import PageContainer from '@/components/layout/pageContainer';
import { useRouter } from 'next/router';

const ViewProject = () => {
  const router = useRouter();
  const { projectId } = router.query;

  return (
    <Layout>
    <PageContainer title={`Project: ${projectId}`}>
      <></>
    </PageContainer>
  </Layout>
  );
};

export default ViewProject;
