import React, { useState } from 'react';

type Task = {
  text: string;
  completed: boolean;
};

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTask(event.target.value);
  };

  const handleAddTask = () => {
    if (currentTask.trim() !== '') {
      setTasks((prevTasks) => [...prevTasks, { text: currentTask, completed: false }]);
      setCurrentTask('');
    }
  };

  const handleStartEditing = (index: number, task: string) => {
    setEditingIndex(index);
    setEditingText(task);
  };

  const handleCancelEditing = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const handleSaveEditing = () => {
    if (editingText.trim() !== '') {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        updatedTasks[editingIndex!] = { ...updatedTasks[editingIndex!], text: editingText };
        return updatedTasks;
      });
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleDeleteTask = (index: number) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTask();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.text.localeCompare(b.text);
    } else {
      return b.text.localeCompare(a.text);
    }
  });

  return (
    <div className="container">
      <h2 className="title">Lista de Tareas</h2>
      <div className="input-container">
        <textarea
          value={currentTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ingrese una tarea"
          className="input-field"
          autoFocus
        />
        <button onClick={handleAddTask} className="add-button">
          +
        </button>
      </div>
      {tasks.length > 0 && (
        <div className="controls">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar tarea"
            className="search-input"
          />
          <button onClick={handleSortOrder} className="sort-button">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      )}
      {sortedTasks.length > 0 ? (
        <ul className="task-list">
          {sortedTasks.map((task, index) => (
            <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {
                  const updatedTasks = [...tasks];
                  updatedTasks[index].completed = !updatedTasks[index].completed;
                  setTasks(updatedTasks);
                }}
              />
              {editingIndex === index ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={handleSaveEditing} className="edit-button">
                    Cambiar
                  </button>
                  <button onClick={handleCancelEditing} className="delete-button">
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div className={`task-text ${task.completed ? 'completed-text' : ''}`}>
                    {task.text}
                  </div>
                  <div className="buttons-container">
                    <button onClick={() => handleStartEditing(index, task.text)} className="edit-button">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteTask(index)} className="delete-button">
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-list">No hay tareas</p>
      )}
    </div>
  );
};

export default TodoList;
