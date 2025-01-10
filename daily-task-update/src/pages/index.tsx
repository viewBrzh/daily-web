import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/my-tasks");
  }, [router]);

  return null;
};

export default Home;