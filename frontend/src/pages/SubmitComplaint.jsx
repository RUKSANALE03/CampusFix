
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, Send, CheckCircle } from "lucide-react";
import api from "../services/api";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setPrediction(null);
    setLoading(true);

    try {
      const response = await api.post("/complaints", form);

      setPrediction(response.data.prediction);
      setForm({ title: "", description: "" });
    } catch (err) {
      setError(
        err.response?.data?.error || "Unable to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <div>
          <span className="eyebrow">REPORT AN ISSUE</span>
          <h1>Submit a Complaint</h1>
          <p>Tell us about the problem you are facing on campus.</p>
        </div>
      </div>

      <div className="form-layout">
        <div className="complaint-form-card">
          <h2>Complaint Details</h2>
          <p>Provide accurate information about the issue.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Complaint Title</label>
            <input
              className="form-control"
              name="title"
              placeholder="Example: Classroom projector not working"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              required
            />

            <label>Describe the Problem</label>
            <textarea
              className="form-control complaint-textarea"
              name="description"
              placeholder="Explain the problem in detail..."
              value={form.description}
              onChange={handleChange}
              minLength={10}
              maxLength={2000}
              required
            />

            <div className="form-hint">
              Our Machine Learning system will analyse your description.
            </div>

            <button
              className="dashboard-primary-btn submit-btn"
              disabled={loading}
            >
              <Send size={17} />
              {loading ? "Analysing..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        <div className="ml-info-card">
          <div className="ml-icon">
            <BrainCircuit size={28} />
          </div>

          <h3>AI-Powered Classification</h3>
          <p>
            CampusFix uses Machine Learning to analyse your complaint
            and suggest its category, priority and responsible department.
          </p>

          <div className="ml-feature">
            <CheckCircle size={17} />
            Automatic category prediction
          </div>

          <div className="ml-feature">
            <CheckCircle size={17} />
            Priority classification
          </div>

          <div className="ml-feature">
            <CheckCircle size={17} />
            Department recommendation
          </div>
        </div>
      </div>

      {prediction && (
        <div className="prediction-card">
          <div className="prediction-heading">
            <BrainCircuit size={23} />
            <div>
              <h3>ML Analysis Complete</h3>
              <p>Your complaint has been saved successfully.</p>
            </div>
          </div>

          <div className="prediction-results">
            <div>
              <span>Category</span>
              <strong>{prediction.category}</strong>
            </div>

            <div>
              <span>Predicted Priority</span>
              <strong>{prediction.priority}</strong>
            </div>

            <div>
              <span>Suggested Department</span>
              <strong>{prediction.department}</strong>
            </div>
          </div>

          <button
            className="dashboard-primary-btn"
            onClick={() => navigate("/complaints")}
          >
            Track My Complaint
          </button>
        </div>
      )}
    </div>
  );
}

export default SubmitComplaint;
