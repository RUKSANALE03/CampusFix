
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  ShieldCheck
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <ShieldCheck size={29} />
        <span>CampusFix</span>
      </div>

      <p className="sidebar-label">MAIN MENU</p>

      <nav>
        <NavLink to="/student" end className="sidebar-link">
          <LayoutDashboard size={19} />
          Dashboard
        </NavLink>

        <NavLink to="/submit" className="sidebar-link">
          <FilePlus size={19} />
          Submit Complaint
        </NavLink>

        <NavLink to="/complaints" className="sidebar-link">
          <ClipboardList size={19} />
          My Complaints
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <ShieldCheck size={18} />
        <span>Making campuses better</span>
      </div>
    </aside>
  );
}

export default Sidebar;
