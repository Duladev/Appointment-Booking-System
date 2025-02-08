import React, { useState } from 'react';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // Switch between user and admin

  return (
    <div className="App">
      <h1>Appointment Booking System</h1>
      <button onClick={() => setIsAdmin(!isAdmin)}>
        {isAdmin ? "Switch to User" : "Switch to Admin"}
      </button>

      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default App;
