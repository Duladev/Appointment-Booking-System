import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import UserLogin from "./components/UserLogin";
import AdminLogin from "./components/AdminLogin";
import UserRegister from "./components/UserRegister";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserAppointment from "./components/UserAppointment";
import AdminAppointments from "./components/AdminAppointments";
import BookAppointment from './components/BookAppointment';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/register" element={<UserRegister />} />  {/* New Registration Route */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/appointment" element={<UserAppointment />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
};

export default App;
