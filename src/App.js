import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  //čuvanje to-do stavki
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });

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

    //dodavanje novog todo-a i resetovanje unosa

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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
