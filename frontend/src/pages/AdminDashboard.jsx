
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/complaints");
      const data = response.data;

      setComplaints(
        Array.isArray(data) ? data : data.complaints || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load complaints. Please check your admin login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/complaints/${id}`, { status });
      await fetchComplaints();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update complaint status."
      );
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const progress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(c => c.status === filter);

  const chartData = [
    { name: "Pending", count: pending },
    { name: "In Progress", count: progress },
    { name: "Resolved", count: resolved }
  ];

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">CAMPUSFIX ADMINISTRATION</span>
          <h1>Admin Dashboard</h1>
          <p>Monitor and manage campus complaints.</p>
        </div>

        <button className="admin-refresh" onClick={fetchComplaints}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="admin-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <section className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">
            <ClipboardList />
          </div>
          <div>
            <p>Total Complaints</p>
            <h2>{total}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Clock />
          </div>
          <div>
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">
            <LayoutDashboard />
          </div>
          <div>
            <p>In Progress</p>
            <h2>{progress}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon green">
            <CheckCircle />
          </div>
          <div>
            <p>Resolved</p>
            <h2>{resolved}</h2>
          </div>
        </div>
      </section>

      <section className="admin-chart-card">
        <div className="admin-section-heading">
          <div>
            <h2>Complaint Analytics</h2>
            <p>Overview of complaint status</p>
          </div>
        </div>

        <div className="admin-chart">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6256d9" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="admin-table-card">
        <div className="admin-section-heading">
          <div>
            <h2>Manage Complaints</h2>
            <p>Review complaints and update their status.</p>
          </div>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="admin-filter"
          >
            <option value="All">All Complaints</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <p className="admin-message">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="admin-message">No complaints found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map(complaint => (
                  <tr key={complaint.id}>
                    <td>#{complaint.id}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>
                      <span className={`priority ${String(complaint.priority || "").toLowerCase()}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td>{complaint.department}</td>
                    <td>
                      <span className={`status ${complaint.status?.toLowerCase().replace(" ", "-")}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={complaint.status}
                        onChange={e =>
                          updateStatus(complaint.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
