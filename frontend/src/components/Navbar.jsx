
import { Bell, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("campusfix_user") || "{}");

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("campusfix_user");
    navigate("/login");
  };

  return (
    <header className="top-navbar">
      <div>
        <span className="navbar-welcome">CampusFix Portal</span>
      </div>

      <div className="navbar-right">
        <Bell size={19} />
        <div className="user-profile">
          <UserCircle size={25} />
          <span>{user.name || "Student"}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
