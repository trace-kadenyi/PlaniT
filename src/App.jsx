import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import PrimaryHeader from "./components/headers/PrimaryHeader";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/footer/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import Event from "./components/dashboard/Event";
import EditEventForm from "./components/taskManagerFolders/events/EditEventForm";

function App() {
  return (
    <>
      <Router>
        <PrimaryHeader />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/events/:id/edit" element={<EditEventForm />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
