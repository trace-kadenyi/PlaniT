import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import PrimaryHeader from "./components/headers/PrimaryHeader";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/footer/Footer";
import Events from "./pages/Events";
import Event from "./pages/Event";
import EditEventForm from "./components/taskManagerFolders/events/forms/EditEventForm";
import CreateEventForm from "./components/taskManagerFolders/events/forms/CreateEventForm";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <PrimaryHeader />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/events/:id/edit" element={<EditEventForm />} />
          <Route path="/events/create" element={<CreateEventForm />} />
<Route path="/board" element={<KanbanBoard />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
