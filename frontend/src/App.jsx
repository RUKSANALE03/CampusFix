
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function ProtectedRoute({ children, adminOnly = false }) {
  const user = JSON.parse(
    localStorage.getItem("campusfix_user") || "null"
  );

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/student" replace />;
  }

  if (!adminOnly && user.role !== "student") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function StudentLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-section">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student" element={
          <ProtectedRoute>
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        } />

        <Route path="/submit" element={
          <ProtectedRoute>
            <StudentLayout>
              <SubmitComplaint />
            </StudentLayout>
          </ProtectedRoute>
        } />

        <Route path="/complaints" element={
          <ProtectedRoute>
            <StudentLayout>
              <MyComplaints />
            </StudentLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
