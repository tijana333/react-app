import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const addTodo = (newTodo) => {
    const todoToAdd = { id: Date.now(), ...newTodo };
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

  const updateTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, title: newTodo.title, description: newTodo.description }
          : todo
      )
    );

    setCurrentTodo(null); //resetovanje stavke koju smo uredjivali
    setNewTodo({ title: "", description: "" });
  };
  //izmena
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (currentTodo) {
      updateTodo(currentTodo.id, newTodo);
    }
  };
  const deleteTodo = (id) => {
    const todoToDelete = todos.find((todo) => todo.id == id);
    setDeletedTodos((prev) => [...prev, todoToDelete]);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const restoreTodo = (id) => {
    const todoToRestore = deletedTodos.find((todo) => todo.id === id);
    setTodos((prev) => [...prev, todoToRestore]);
    setDeletedTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(newTodo);
    setNewTodo({ title: "", description: "" });
  };

  const filteredTodos = [...todos, ...deletedTodos].filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <input
        type="text"
        placeholder="Search To-Dos"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Dinamicki predlozi */}
      {searchQuery && (
        <ul>
          {filteredTodos.map((todo, index) => (
            <li key={index}>
              {todo.title} - {todo.description}
              {""}
              {todos.includes(todo) ? "(Active)" : "(Deleted)"}
            </li>
          ))}
        </ul>
      )}
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
            <button onClick={() => restoreTodo(todo.id)}>Restore</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
