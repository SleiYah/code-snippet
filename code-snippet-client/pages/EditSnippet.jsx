import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../src/config";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/addSnippet.css";

const EditSnippet = () => {
  const [formData, setFormData] = useState({
    title: "",
    prefix: "",
    body: "",
    tags: "",
    favorite: false
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/getSnippetById/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const snippet = response.data.snippet; 
          
          const tagsString = snippet.tags.map(tag => tag.title).join(' ');

          setFormData({
            title: snippet.title || "",
            prefix: snippet.prefix || "",
            body: snippet.body || "",
            tags: tagsString,
            favorite: snippet.favorite || false
          });
        } else {
          setError("Failed to load snippet");
        }
      } catch (err) {
        console.error(err);
        setError("Error connecting to server");
      }
    };

    fetchSnippet();
  }, [user, id, navigate, token]);

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
      const response = await axios.post(
        `${API_BASE_URL}/user/addOrUpdateSnippet/${id}`,
        {
          user_id: user,
          title: formData.title,
          prefix: formData.prefix,
          body: formData.body,
          tags: formData.tags,
          favorite: formData.favorite
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.snippet) {
        navigate("/snippets");
      } else {
        setError(response.data.error || "Failed to update snippet");
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
          <h1>Edit Snippet</h1>
          <p>Update your code snippet</p>
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
              Update Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSnippet;