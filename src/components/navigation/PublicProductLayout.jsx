import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Layout from "./Layout";
import Footer from "../footer/Footer";

const PublicProductLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // For logged-in users: Show with sidebar
  if (isAuthenticated) {
    return (
      <>
        <Layout>
          <Outlet />
        </Layout>
        <Footer />
      </>
    );
  }
  
  // For non-logged-in users: Show without sidebar
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicProductLayout;