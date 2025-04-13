import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import './Column.css';

function Column({ id, title, tasks, onEditTask, onDeleteTask, onViewTask, onMoveTask }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.status !== id) {
        onMoveTask(item.id, id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop} 
      className={`column ${isOver ? 'column-highlight' : ''}`}
    >
      <div className="column-header">
        <h2>{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onView={onViewTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="empty-column">No tasks</div>
        )}
      </div>
    </div>
  );
}

export default Column;