import React from 'react';
import './TaskView.css';

function TaskView({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  const getDueDateClass = () => {
    if (!task.due_date) return '';
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'overdue';
    if (daysDiff <= 2) return 'due-soon';
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityLabel = (priority) => {
    if (!priority) return 'Normal';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Backlog';
    
    switch(status) {
      case 'backlog': return 'Backlog';
      case 'doing': return 'Queue';
      case 'ongoing': return 'On Progress';
      case 'ontest': return 'On Test';
      case 'done': return 'Done';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const dueDateClass = getDueDateClass();
  const priorityClass = `priority-${task.priority || 'normal'}`;

  return (
    <div className="modal-overlay">
      <div className="task-view-container">
        <div className="task-view-header">
          <h2>Task Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="task-view-content">
          <div className={`task-view-title ${priorityClass}`}>
            <h3>{task.title}</h3>
          </div>
          
          <div className="task-view-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Status:</span>
              <span className={`status-badge status-${task.status}`}>{getStatusLabel(task.status)}</span>
            </div>
            
            <div className="metadata-item">
              <span className="metadata-label">Priority:</span>
              <span className={`priority-badge ${priorityClass}`}>{getPriorityLabel(task.priority)}</span>
            </div>
            
            <div className="metadata-item">
              <span className="metadata-label">Due Date:</span>
              <span className={`due-date ${dueDateClass}`}>{formatDate(task.due_date)}</span>
            </div>
            
            {task.assigned_to && (
              <div className="metadata-item">
                <span className="metadata-label">Assigned To:</span>
                <span className="assigned-to">{task.assigned_to}</span>
              </div>
            )}
          </div>
          
          <div className="task-view-description">
            <h4>Description</h4>
            <p>{task.description || 'No description provided.'}</p>
          </div>
        </div>
        
        <div className="task-view-actions">
          <button className="delete-btn" onClick={() => { onDelete(task.id); onClose(); }}>
            <i className="fas fa-trash"></i> Delete
          </button>
          <button className="edit-btn" onClick={() => { onEdit(task); onClose(); }}>
            <i className="fas fa-edit"></i> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskView;