import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';

function App() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, enhanceTask } = useTasks();
  const [filter, setFilter] = useState('all'); // all, open, done

  const filteredTasks = tasks.filter(t => {
    if (filter === 'open') return t.status === 'open';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  return (
    <div>
      <h1>✨ AI To-Do List</h1>
      
      <TaskForm onSubmit={createTask} />

      <div className="flex justify-between items-center my-6">
        <div className="flex gap-2">
          <button 
            className={filter === 'all' ? '' : 'secondary'} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'open' ? '' : 'secondary'} 
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button 
            className={filter === 'done' ? '' : 'secondary'} 
            onClick={() => setFilter('done')}
          >
            Done
          </button>
        </div>
        <div className="text-gray text-sm">
          {filteredTasks.length} tasks
        </div>
      </div>

      {error && <div className="text-danger mb-4">Error: {error}</div>}
      {loading && tasks.length === 0 ? (
        <div className="text-center p-8">Loading...</div>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onUpdate={updateTask} 
          onDelete={deleteTask}
          onEnhance={enhanceTask}
        />
      )}
    </div>
  );
}

export default App;
