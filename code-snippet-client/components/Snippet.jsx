import React from "react";
import { Link } from "react-router-dom";
import "../styles/snippet.css";

const Snippet = ({ snippet, onDelete }) => {
  const { id, title, prefix, body, tags } = snippet;

  return (
    <div className="snippet-card">
      <div className="snippet-content">
        <h3 className="snippet-title">{title}</h3>
        
        <div className="snippet-tags">
          {tags && tags.map(tag => (
            <span key={tag.id} className="snippet-tag">{tag.title}</span>
          ))}
        </div>

        <p className="snippet-prefix">
          <strong>Prefix:</strong> {prefix}
        </p>

        <div className="snippet-body">
          <p>
            {body.length > 100
              ? `${body.substring(0, 100)}...`
              : body}
          </p>
        </div>

        <div className="snippet-actions">
          <Link to={`/edit-snippet/${id}`} className="edit-btn">
            Edit
          </Link>
          <button
            onClick={() => onDelete(snippet)}
            className="delete-btn"
            aria-label={`Delete ${title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Snippet;