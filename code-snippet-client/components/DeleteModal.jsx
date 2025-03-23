import React from "react";
import "../styles/deleteModal.css";

const DeleteModal = ({ snippet, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Delete Snippet</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="delete-preview code-preview">
            <pre>{snippet.body.length > 100 
              ? snippet.body.substring(0, 100) + "..." 
              : snippet.body}
            </pre>
          </div>

          <p className="delete-message">
            Are you sure you want to delete <strong>{snippet.title}</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-button" onClick={() => onConfirm(snippet.id)}>
            Delete Snippet
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;