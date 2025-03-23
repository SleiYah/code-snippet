import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../src/config";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addSnippet.css";

const AddSnippet = () => {
  const [formData, setFormData] = useState({
    title: "",
    prefix: "",
    body: "",
    tags: "",
    favorite: false
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.prefix.trim() || !formData.body.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.tags.trim()) {
      setError("Please provide at least one tag");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/addOrUpdateSnippet/add`, {
        user_id: user,
        title: formData.title,
        prefix: formData.prefix,
        body: formData.body,
        tags: formData.tags,
        favorite: formData.favorite
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.snippet) {
        navigate("/snippets");
      } else {
        setError(response.data.error || "Failed to add snippet");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Add New Snippet</h1>
          <p>Save a useful code snippet to your collection</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="snippet-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your snippet a title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prefix">Prefix</label>
            <input
              type="text"
              id="prefix"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              placeholder="Shortcut prefix for your snippet"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Code</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Your code snippet goes here"
              rows="10"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (space separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="E.g., javascript react frontend"
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="favorite"
                checked={formData.favorite}
                onChange={handleChange}
              />
              Mark as favorite
            </label>
          </div>

          <div className="form-actions">
            <Link to="/snippets" className="cancel-button">
              Cancel
            </Link>
            <button type="submit" className="submit-button">
              Add Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSnippet;