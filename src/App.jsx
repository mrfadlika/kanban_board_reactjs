import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './components/Board';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskView from './components/TaskView';
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://laravel-be.raffifadlika.com/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  const columns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'doing', title: 'Queue' },
    { id: 'ongoing', title: 'On Progress' },
    { id: 'ontest', title: 'On Test' },
    { id: 'done', title: 'Done' }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post('/tasks', taskData);
      setTasks([...tasks, response.data]);
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const response = await axios.put(`/tasks/${id}`, updatedData);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      if (viewingTask && viewingTask.id === id) {
        setViewingTask(null);
        setIsViewOpen(false);
      }
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const moveTask = async (id, newStatus) => {
    try {
      const response = await axios.patch(`/tasks/${id}/move`, { status: newStatus });
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (err) {
      setError('Failed to move task. Please try again.');
      console.error('Error moving task:', err);
      // Revert optimistic UI update
      fetchTasks();
    }
  };

  const openForm = (task = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const openTaskView = (task) => {
    setViewingTask(task);
    setIsViewOpen(true);
  };

  const closeTaskView = () => {
    setIsViewOpen(false);
    setViewingTask(null);
  };

  return (
    <div className="app">
      <Navbar onAddClick={() => openForm()} />
      {error && <div className="error-message">{error}</div>}
      
      <DndProvider backend={HTML5Backend}>
        <div className="board-container">
          {isLoading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <Board 
              columns={columns} 
              tasks={tasks}
              onEditTask={openForm}
              onDeleteTask={deleteTask}
              onViewTask={openTaskView}
              onMoveTask={moveTask}
            />
          )}
        </div>
      </DndProvider>

      {isFormOpen && (
        <TaskForm 
          task={editingTask}
          onSubmit={editingTask ? updateTask : addTask}
          onCancel={closeForm}
        />
      )}

      {isViewOpen && viewingTask && (
        <TaskView
          task={viewingTask}
          onClose={closeTaskView}
          onEdit={openForm}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default App;