import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import PrimaryHeader from "./components/headers/PrimaryHeader";
import HomePage from "./pages/HomePage";
import Footer from "./components/footer/Footer";
import Events from "./pages/Events";
import Event from "./pages/Event";
import EditEventForm from "./components/taskManagerCollection/events/forms/EditEventForm";
import CreateEventForm from "./components/taskManagerCollection/events/forms/CreateEventForm";
import EditClientForm from "./components/clients/EditClientForm";
import CreateClientForm from "./components/clients/CreateClientForm";
import TasksBoard from "./pages/TasksBoard";
import EventsBoard from "./pages/EventsBoard";

import useIsSmallScreen from "./globalHooks/useIsSmallScreen";

function App() {
  const isSmallScreen = useIsSmallScreen();
  return (
    <>
      {isSmallScreen ? (
        <Toaster position="top-center" />
      ) : (
        <Toaster position="top-right" />
      )}
      <Router>
        <PrimaryHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/events/:id/edit" element={<EditEventForm />} />
          <Route path="/events/create" element={<CreateEventForm />} />
          <Route path="/clients/:id/edit" element={<EditClientForm />} />
          <Route path="/clients/new" element={<CreateClientForm />} />
          <Route path="/tasks/board" element={<TasksBoard />} />
          <Route path="/events/board" element={<EventsBoard />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
