import React, { useState } from "react";
import { API_BASE_URL } from "../src/config";

import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/guest/signup`, {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (data.success === true) {
        setSuccess(true);
        console.log("response",response)

      } else {
       
      console.log("response",response)
           console.log("response",response)
     
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || `Error: ${err.response.status}`);
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Request error. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Your Gallery</h1>
          <p>Your colorful space for precious memories</p>
        </div>

        {success ? (
          <div className="success-message">
            <h3>Welcome aboard! 🎉</h3>
            <p>
              Your personal gallery is ready. Time to share your beautiful
              moments with the world.
            </p>
            <Link to="/login" className="login-link">
              Login to continue
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="signup-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-button">
              Sign Up{" "}
            </button>

            <div className="login-prompt">
              Already have a gallery?{" "}
              <Link to="/login" className="login-link">
                Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
