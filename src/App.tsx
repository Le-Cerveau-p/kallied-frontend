import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import DashboardRouter from "./pages/DashboardRouter";
import Features from "./pages/Features";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      {/* {Public} */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      
        {/* Protected (later) */}
      <Route path="/dashboard/admin" element={ <ProtectedRoute roles={['ADMIN']}> <AdminDashboard /> </ProtectedRoute> }/>

      <Route path="/dashboard/staff" element={ <ProtectedRoute roles={['STAFF']}> <StaffDashboard /> </ProtectedRoute> }/>

      <Route path="/dashboard/client" element={ <ProtectedRoute roles={['CLIENT']}> <ClientDashboard /> </ProtectedRoute> }/>
      <Route path="/dashboard" element={ <ProtectedRoute roles={['ADMIN','STAFF','CLIENT']}> <DashboardRouter /> </ProtectedRoute> }/>
      <Route path="/profile" element={<ProtectedRoute roles={['ADMIN', 'STAFF', 'CLIENT']}> <ProfilePage /> </ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute roles={['ADMIN', 'STAFF', 'CLIENT']}> <SettingsPage /> </ProtectedRoute>} />
    </Routes>
  );
}

export default App;