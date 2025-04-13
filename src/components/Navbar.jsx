import React from 'react';
import './Navbar.css';

function Navbar({ onAddClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <i className="fas fa-tasks"></i>
        <h1>Kanban Board by Raffi Fadlika</h1>
      </div>
      <div className="navbar-actions">
        <button className="add-task-btn" onClick={onAddClick}>
          <i className="fas fa-plus"></i>
          Add Task
        </button>
      </div>
    </nav>
  );
}

export default Navbar;