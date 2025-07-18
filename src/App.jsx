import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/footer/Footer";
import Dashboard from "./components/dashboard/Dashboard";
import Event from "./components/dashboard/Event";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events/:id" element={<Event />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
