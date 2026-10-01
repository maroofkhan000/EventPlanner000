import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import Services from "./pages/Services";
import Destination from "./pages/Destination";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import PackageBuilder from "./pages/PackageBuilder";
import VenueDetails from "./pages/VenueDetails";
import AdminVenues from "./pages/AdminVenues";

// Context
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/destination" element={<Destination />} />
              <Route path="/contact" element={<Destination />} />
              <Route path="/about" element={<About />} />
              <Route path="/package-builder" element={<PackageBuilder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/admin/venues" element={<AdminVenues />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
