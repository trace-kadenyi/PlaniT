import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Layout from "./Layout";

const PublicProductLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // For logged-in users: Show with sidebar
  if (isAuthenticated) {
    return (
      <>
        <Layout>
          <Outlet />
        </Layout>
      </>
    );
  }

  // For non-logged-in users: Show without sidebar
  return (
    <>
      <Outlet />
    </>
  );
};

export default PublicProductLayout;
