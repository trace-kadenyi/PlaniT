import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import PrimaryHeader from "./components/headers/PrimaryHeader";
import HomePage from "./pages/HomePage";
import Footer from "./components/footer/Footer";
import Events from "./pages/Events";
import Event from "./pages/Event";
import Clients from "./pages/Clients";
import Client from "./pages/Client";
import Vendors from "./pages/Vendors";
import EditEventForm from "./components/taskManagerCollection/events/forms/EditEventForm";
import CreateEventForm from "./components/taskManagerCollection/events/forms/CreateEventForm";
import EditClientForm from "./components/clients/forms/EditClientForm";
import CreateClientForm from "./components/clients/forms/CreateClientForm";
import EditVendorForm from "./components/vendors/forms/EditVendorForm";
import CreateVendorForm from "./components/vendors/forms/CreateVendorForm";
import TasksBoard from "./pages/TasksBoard";
import EventsBoard from "./pages/EventsBoard";

import useIsSmallScreen from "./globalHooks/useIsSmallScreen";
import Vendor from "./pages/Vendor";

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
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<Client />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<Vendor />} />
          <Route path="/events/:id/edit" element={<EditEventForm />} />
          <Route path="/events/new" element={<CreateEventForm />} />
          <Route path="/clients/:id/edit" element={<EditClientForm />} />
          <Route path="/clients/new" element={<CreateClientForm />} />
          <Route path="/vendors/:id/edit" element={<EditVendorForm />} />
          <Route path="/vendors/new" element={<CreateVendorForm />} />
          <Route path="/tasks/board" element={<TasksBoard />} />
          <Route path="/events/board" element={<EventsBoard />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
