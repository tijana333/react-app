import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });

  const addTodo = (content) => {
    const newTodo = { id: Date.now(), content };
    setTodos((prev) => [...prev, newTodo]);
  };

  const editTodo = (todo) => {
    setCurrentTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description,
    });
  };

  // azuriranje

  const updateTodo = (id, updatedContent) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, content: updatedContent } : todo
      )
    );

    setCurrentTodo(null); //resetovanje stavke koju smo uredjivali
    setNewTodo({ title: "", description: " " });
  };
  //izmena
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (currentTodo) {
      updateTodo(currentTodo.id, newContent);
    }
  };

  const deleteTodo = (id) => {
    const todoToDelete = todos.find((todo) => todo.id == id);
    setDeletedTodos((prev) => [...prev, todoToDelete]);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  /*
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });
*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // azuriranje state-a sa unetim vrednostima
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(newTodo);
    setTodos([...todos, newTodo]);
    setNewTodo({ title: "", description: "" });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newTodo.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <input
          type="text"
          name="description"
          value={newTodo.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <button type="submit">Add To-Do</button>
      </form>
      <h2>Your To-Do List:</h2>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <h3>{todo.title} </h3>
            <p>{todo.description}</p>
            <button onClick={() => editTodo(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {currentTodo && (
        <form onSubmit={handleUpdateSubmit}>
          <input
            type="text"
            name="title"
            value={newTodo.title}
            onChange={handleChange}
            placeholder="Edit Title"
            required
          />
          <input
            type="text"
            name="description"
            value={newTodo.description}
            onChange={handleChange}
            placeholder="Edit Description"
            required
          />
          <button type="submit">Update </button>
        </form>
      )}

      <h2>Deleted items: </h2>
      <ul>
        {deletedTodos.map((todo) => (
          <li key={todo.id}>
            {" "}
            {todo.title} - {todo.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
