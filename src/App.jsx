import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/footer/Footer";
import TestEvents from "./components/tests/TestEvents";

function App() {
  return (
    <>
     <div>
      <TestEvents />
    </div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
