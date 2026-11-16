
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
  ArrowUpRight
} from "lucide-react";
import api from "../services/api";

function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");
        setComplaints(response.data);
      } catch (error) {
        console.error("Unable to load complaints", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const pending = complaints.filter(
    item => item.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    item => item.status === "Resolved"
  ).length;

  const stats = [
    {
      title: "Total Complaints",
      value: complaints.length,
      icon: FileText,
      color: "blue"
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "orange"
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "green"
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <div>
          <span className="eyebrow">STUDENT PORTAL</span>
          <h1>Welcome back!</h1>
          <p>Track and manage your campus complaints.</p>
        </div>

        <Link to="/submit" className="dashboard-primary-btn">
          <Plus size={18} />
          New Complaint
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={index}>
              <div className={`stat-icon ${item.color}`}>
                <Icon size={23} />
              </div>

              <p>{item.title}</p>
              <h2>{item.value}</h2>
              <span>Updated from your records</span>
            </div>
          );
        })}
      </div>

      <div className="section-heading">
        <div>
          <h2>Recent Complaints</h2>
          <p>Your latest reported campus issues</p>
        </div>

        <Link to="/complaints" className="view-link">
          View all <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="complaint-table-wrapper">
        {loading ? (
          <p className="empty-state">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} />
            <h3>No complaints yet</h3>
            <p>Submit your first complaint to get started.</p>
            <Link to="/submit" className="dashboard-primary-btn">
              Submit Complaint
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table complaint-table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {complaints.slice(0, 5).map(item => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`priority ${item.priority?.toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${item.status.toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
