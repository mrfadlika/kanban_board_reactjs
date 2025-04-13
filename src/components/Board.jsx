import React from 'react';
import Column from './Column';
import './Board.css';

function Board({ columns, tasks, onEditTask, onDeleteTask, onViewTask, onMoveTask }) {
  return (
    <div className="board">
      {columns.map(column => (
        <Column
          key={column.id}
          id={column.id}
          title={column.title}
          tasks={tasks.filter(task => task.status === column.id)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onViewTask={onViewTask}
          onMoveTask={onMoveTask}
        />
      ))}
    </div>
  );
}

export default Board;