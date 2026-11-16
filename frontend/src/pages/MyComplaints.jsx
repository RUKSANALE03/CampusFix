
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import api from "../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/complaints")
      .then(response => setComplaints(response.data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <div>
          <span className="eyebrow">COMPLAINT HISTORY</span>
          <h1>My Complaints</h1>
          <p>View and track all the issues you have reported.</p>
        </div>
      </div>

      <div className="complaint-table-wrapper">
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} />
            <h3>No complaints found</h3>
            <p>Your submitted complaints will appear here.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table complaint-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map(item => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`priority ${item.priority?.toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>{item.department}</td>
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

export default MyComplaints;
