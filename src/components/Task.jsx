// src/components/Task.jsx
import React from 'react';
import { useDrag } from 'react-dnd';
import './Task.css';

function Task({ task, onEdit, onDelete, onView }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Calculate due date proximity
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

  const priorityClass = `priority-${task.priority || 'normal'}`;
  const dueDateClass = getDueDateClass();

  // Handle click to view task details
  const handleTaskClick = (e) => {
    // Only trigger view if we're not clicking on actions buttons
    if (!e.target.closest('.task-actions')) {
      onView(task);
    }
  };

  return (
    <div 
      ref={drag}
      className={`task ${priorityClass} ${dueDateClass} ${isDragging ? 'is-dragging' : ''}`}
      onClick={handleTaskClick}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="edit-button">
            <i className="fas fa-edit"></i>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="delete-button">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description.length > 70 
          ? `${task.description.substring(0, 70)}...` 
          : task.description}
        </p>
      )}
      
      <div className="task-footer">
        {task.due_date && (
          <div className={`due-date ${dueDateClass}`}>
            <i className="far fa-calendar"></i>
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
        
        {task.assigned_to && (
          <div className="assigned-to">
            <i className="far fa-user"></i>
            {task.assigned_to}
          </div>
        )}
      </div>
    </div>
  );
}

export default Task;