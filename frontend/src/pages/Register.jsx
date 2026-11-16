
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock, ArrowRight } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

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
    setLoading(true);

    try {
      await api.post("/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-icon">
          <ShieldCheck size={30} />
        </div>
        <h1>CampusFix</h1>
        <p>Making every campus better, together.</p>
      </div>

      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p>Join CampusFix and help improve your campus.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="input-wrapper">
            <User size={18} />
            <input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <label>Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              minLength={8}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>

      <p className="auth-bottom">
        © 2026 CampusFix. Campus care starts here.
      </p>
    </div>
  );
}

export default Register;
