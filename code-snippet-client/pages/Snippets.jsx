import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../src/config";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Snippet from "../components/Snippet";
import DeleteModal from "../components/DeleteModal";
import "../styles/snippets.css";

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [error, setError] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    snippet: null,
  });

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchSnippets();
    fetchTags();
  }, [user, navigate]);
  
  // Apply filters whenever snippets, favorites filter, or tag selection changes
  useEffect(() => {
    applyFilters();
  }, [snippets, showFavoritesOnly, selectedTag]);

  const applyFilters = () => {
    let results = [...snippets];
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      results = results.filter(snippet => snippet.favorite);
    }
    
    setFilteredSnippets(results);
  };

  const fetchSnippets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/getSnippets/${user}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success === true) {
        setSnippets(response.data.snippets);
      } else {
        setError("Failed to load snippets");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/getTags/${user}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success === true) {
        console.log("response",response.data.tags)
        setTags(response.data.tags);
      }
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const searchSnippets = async () => {
    if (!searchQuery.trim()) {
      fetchSnippets();
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/search`, {
        user_id: user,
        search: searchQuery
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success === true) {
        setSnippets(response.data.results);
      } else {
        setError("Search failed");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  const fetchSnippetsByTag = async (tagId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/getSnippetsByTag/${tagId}`,{
        user_id: user,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.data.success === true) {
        setSnippets(response.data.snippets);
      } else {
        setError("Failed to load snippets for this tag");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  const handleTagClick = (tagId) => {
    console.log("tagid",tagId)
    setSelectedTag(tagId);
    setSearchQuery('');
    
    if (tagId === null) {
      fetchSnippets();
    } else {
      fetchSnippetsByTag(tagId);
    }
  };
  
  const toggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const openDeleteModal = (snippet) => {
    setDeleteModal({
      isOpen: true,
      snippet: snippet,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      snippet: null,
    });
  };

  const handleDeleteSnippet = async (snippetId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/deleteSnippet/${snippetId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success === true) {
        setSnippets(snippets.filter((snippet) => snippet.id !== snippetId));
        closeDeleteModal();
      } else {
        setError("Failed to delete snippet");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchSnippets();
  };

  return (
    <div className="snippets-container">
      <header className="snippets-header">
        <div className="header-content">
          <h1>My Code Snippets</h1>
          <div className="user-actions">
            <Link to="/add-snippet" className="add-snippet-btn">
              Add Snippet
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
         
        <div className="filter-options">
          <div className="favorite-filter">
            <button 
              className={`favorite-btn ${showFavoritesOnly ? "active" : ""}`}
              onClick={toggleFavorites}
            >
              {showFavoritesOnly ? "Show All" : "Show Favorites Only"}
            </button>
          </div>

          {tags.length > 0 && (
            <div className="tag-filter">
              <span className="filter-label">Filter by tag:</span>
              <button
                className={`tag-btn ${selectedTag === null ? "active" : ""}`}
                onClick={() => handleTagClick(null)}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className={`tag-btn ${selectedTag === tag.id ? "active" : ""}`}
                  onClick={() => handleTagClick(tag.id)}
                >
                  {tag.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  fetchSnippets();
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {filteredSnippets.length === 0 ? (
        <div className="empty-snippets">
          <p>No snippets found. {showFavoritesOnly ? "You don't have any favorite snippets yet." : "Add some snippets to get started!"}</p>
          {!showFavoritesOnly && (
            <Link to="/add-snippet" className="add-snippet-btn">
              Add Your First Snippet
            </Link>
          )}
          {showFavoritesOnly && snippets.length > 0 && (
            <button onClick={() => setShowFavoritesOnly(false)} className="show-all-btn">
              Show All Snippets
            </button>
          )}
        </div>
      ) : (
        <div className="snippets-grid">
          {filteredSnippets.map((snippet) => (
            <Snippet
              key={snippet.id}
              snippet={snippet}
              onDelete={() => openDeleteModal(snippet)}
            />
          ))}
        </div>
      )}

      {deleteModal.isOpen && deleteModal.snippet && (
        <DeleteModal
          snippet={deleteModal.snippet}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteSnippet}
        />
      )}
    </div>
  );
};

export default Snippets;