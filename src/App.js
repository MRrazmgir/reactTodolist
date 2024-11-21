import React, { useState, useEffect } from 'react';
import './App.css';


function AddForm({ addInput, setAddInput, newTask }) {
  return (
    <div className="division">
      <input
        type="text"
        value={addInput}
        placeholder="Add task..."
        onChange={(e) => setAddInput(e.target.value)}
      />
      <button onClick={newTask}>New</button>
    </div>
  );
}

function Search({
  filterText,
  onFilterTextChange
}) {
  return (
    <div className='division'>
      <form>
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
        <button>Go</button>
      </form>
    </div>
  );
}
function List_Task({ tasks, setTasks, startEdit, DoEdit,filterText}) {
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');

  const handleEditStart = (index) => {
    setEditedTaskIndex(index);
    setEditedTaskName(tasks[index].name); // Set the name of the task to edit
  };

  const handleApplyEdit = (index) => {
    DoEdit(index, editedTaskName);
    setEditedTaskIndex(null); // Reset editing state after applying edit
  };

  return (
    <>
      <div className="list">
        {tasks.map((task, index) => {
          // Check if we should filter by in-progress status

          // Check if the task name contains the filter text
          const matchesFilterText = task.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;

          // Render the task only if it matches both conditions
          if (matchesFilterText) {
            return (
              <div className="division" key={index}>
                {editedTaskIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                      placeholder="Edit task"
                    />
                    <button onClick={() => handleApplyEdit(index)}>Done</button>
                  </>
                ) : (
                  <>
                    <span>{task.name}</span>
                    <button onClick={() => handleEditStart(index)}>Edit</button>
                    <input
                      type="checkbox"
                      checked={task.status === 'Done'}
                      onChange={() => {
                        const updatedTasks = tasks.map((t, i) =>
                          i === index ? { ...t, status: t.status === 'Done' ? 'In Progress' : 'Done' } : t
                        );
                        setTasks(updatedTasks);
                      }}
                    />
                  </>
                )}
              </div>
            );
          }

          // If conditions are not met, return null (or nothing) to skip rendering this task
          return null;
        })}
      </div>
    </>
  );
}

function App() {

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filterText, setFilterText] = useState('');
  const [addInput, setAddInput] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const newTask = () => {
    if (addInput.trim()) {
      setTasks([...tasks, { name: addInput, status: 'In Progress', isEditing: false }]);
      setAddInput('');
    }
  };


  const startEdit = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isEditing: true } : task
    );
    setTasks(updatedTasks);
  };

  const DoEdit = (index, editedTask) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, name: editedTask, isEditing: false } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <body> 
    <div >
    <h1 id="app_title">تو دو لیست</h1>
    <AddForm addInput={addInput} setAddInput={setAddInput} newTask={newTask} />
    <h2>لیست تسک ها</h2>
    <Search filterText={filterText}  onFilterTextChange={setFilterText} 
    />
    <List_Task tasks={tasks} setTasks={setTasks} startEdit={startEdit} DoEdit={DoEdit} filterText={filterText} />
    </div>
    </body>
  );
}

export default App;