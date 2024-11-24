import { useEffect, useState } from 'react';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('https://dummyjson.com/todos?limit=10');
      const result = await response.json();
      setTodos(result.todos);
    })();
  }, []);

  const addTodo = async () => {
    if (!task.trim()) {
      console.error('Task cannot be empty!');
      return;
    }

    try {
      const newTodo = {
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        todo: task,
        completed: false,
        userId: todos.length + 1,
      };

      await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });

      setTask('');
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE',
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  };

  const editTodo = async (id, newTask) => {
    if (!newTask.trim()) {
      console.error('Task cannot be empty!');
      return;
    }

    try {
      const updatedTodo = { id, todo: newTask, completed: false };

      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, todo: newTask } : todo))
      );
    } catch (error) {
      console.error('Error editing todo:', error.message);
    }
  };

  const deleteAllTodos = () => {
    setTodos([]);
    console.warn('All todos have been removed (dummy API does not support delete all).');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-2xl bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Todo App</h1>
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a todo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={deleteAllTodos}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete All
          </button>
        </div>
        <div>
          {todos.length ? (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50"
              >
                <span className="text-gray-700">{todo.todo}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newTask = prompt('Edit your todo:', todo.todo);
                      if (newTask !== null) editTodo(todo.id, newTask);
                    }}
                    className="text-blue-500 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">No todos found. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
