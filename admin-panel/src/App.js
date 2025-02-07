// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import SlotBooking from './SlotBooking';

function App() {
  return (
    <Router>
      <div>
        <div>
          <h1>Appointment Booking System</h1>
        </div>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/book-slot" element={<SlotBooking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
