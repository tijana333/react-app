import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "low",
    createdAt: new Date().toISOString(),
    dueDate: "",
    status: "active",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [sortBy, setSortBy] = useState("creationDate");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedDeletedTodos =
      JSON.parse(localStorage.getItem("deletedTodos")) || [];
    setTodos(savedTodos);
    setDeletedTodos(savedDeletedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deletedTodos", JSON.stringify(deletedTodos));
  }, [todos, deletedTodos]);

  const validateForm = () => {
    if (!newTodo.title || !newTodo.description || !newTodo.dueDate) {
      setErrorMessage("Please fill out all fields.");
      return false;
    }

    // Provera da ne mogu da se unesu samo brojevi
    const titleIsValid = isNaN(newTodo.title);
    const descriptionIsValid = isNaN(newTodo.description);

    if (!titleIsValid) {
      setErrorMessage("Title cannot be just numbers.");
      return false;
    }

    if (!descriptionIsValid) {
      setErrorMessage("Description cannot be just numbers.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleTitleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Provera unosa naslova u toku kucanja
    if (value && !isNaN(value)) {
      setErrorMessage("Title cannot be just numbers.");
    } else {
      setErrorMessage("");
    }
  };

  const addTodo = (newTodo) => {
    const todoToAdd = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...newTodo,
    };
    console.log("Dodajem to-do:", todoToAdd);
    setTodos((prev) => [todoToAdd, ...prev]);
  };

  const editTodo = (todo) => {
    setCurrentTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
    });
    setEditMode(true);
  };

  const updateTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, title: newTodo.title, description: newTodo.description }
          : todo
      )
    );

    setEditMode(false);
    setCurrentTodo(null);
    setNewTodo({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      status: "active",
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && currentTodo) {
      updateTodo(currentTodo.id);
    }
  };

  const deleteTodo = (id) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (todoToDelete) {
      setDeletedTodos((prev) => [
        ...prev,
        { ...todoToDelete, status: "trashed" },
      ]);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } else {
      const todoToDeleteFromFinished = finishedTodos.find(
        (todo) => todo.id === id
      );
      if (todoToDeleteFromFinished) {
        setFinishedTodos((prev) => prev.filter((todo) => todo.id !== id));
      }
    }
  };

  const finishTodo = (id) => {
    const todoToFinish = todos.find((todo) => todo.id === id);
    setFinishedTodos((prev) => [
      ...prev,
      { ...todoToFinish, status: "finished" },
    ]);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const restoreFinishedTodo = (id) => {
    const todoToRestore = finishedTodos.find((todo) => todo.id === id);
    setTodos((prev) => [...prev, todoToRestore]);
    setFinishedTodos((prev) => prev.filter((todo) => todo.id !== id));
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
    if (validateForm()) {
      addTodo(newTodo);

      setNewTodo({ title: "", description: "", priority: "low", dueDate: "" });
    }
  };

  const filteredTodos = () => {
    return filteredAndSortedTodos().filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sortedTodos = () => {
    return todos.slice().sort((a, b) => {
      if (sortBy === "creationDate") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3, normal: 4 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === "status") {
        const statusOrder = { active: 1, finished: 2, trashed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
  };

  const filteredAndSortedTodos = () => {
    return sortedTodos().filter((todo) => {
      if (filterBy === "active") return todo.status === "active";
      if (filterBy === "finished") return todo.status === "finished";
      if (filterBy === "trashed") return todo.status === "trashed";
      return true;
    });
  };

  const updateStatus = (id, newStatus) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newTodo.title}
          onChange={handleTitleChange}
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
        <select
          name="priority"
          value={newTodo.priority}
          onChange={handleChange}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={newTodo.dueDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Add To-Do</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="creationDate">Sort by Creation Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="status">Sort by Status</option>
      </select>

      <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
        <option value="all">Show all</option>
        <option value="active">Show Active</option>
        <option value="finished">Show Finished</option>
        <option value="trashed">Show Trashed</option>
      </select>

      <input
        type="text"
        placeholder="Search To-Dos"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery && (
        <ul>
          {filteredTodos().map((todo, index) => (
            <li key={index}>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <p>Due Date: {todo.dueDate}</p>
              <p>Priority: {todo.priority}</p>
              <p>Status: {todo.status}</p>
              {todos.includes(todo) ? "(Active)" : "(Deleted)"}
            </li>
          ))}
        </ul>
      )}

      <h2>Your Active To-Do List:</h2>
      <ul>
        {filteredAndSortedTodos().map((todo) => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Due Date: {todo.dueDate}</p>
            <p>Priority: {todo.priority}</p>
            <button onClick={() => editTodo(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button onClick={() => finishTodo(todo.id)}>Finish</button>
          </li>
        ))}
      </ul>

      {editMode && (
        <form onSubmit={handleUpdateSubmit}>
          <h3>Edit To-Do</h3>
          <input
            type="text"
            name="title"
            value={newTodo.title}
            onChange={handleTitleChange}
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
          <select
            name="priority"
            value={newTodo.priority}
            onChange={handleChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={newTodo.dueDate}
            onChange={handleChange}
            required
          />
          <button type="submit">Update To-Do</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      )}

      {finishedTodos.length > 0 && <h2> Finished To-Dos:</h2>}
      <ul>
        {finishedTodos.map((todo) => (
          <li key={todo.id}>
            <h3> {todo.title}</h3>
            <p>{todo.description}</p>
            <p>Due Date: {todo.dueDate} </p>
            <p>Priority: {todo.priority}</p>

            <button onClick={() => restoreFinishedTodo(todo.id)}>
              {" "}
              Restore{" "}
            </button>
            <button onClick={() => deleteTodo(todo.id)}> Delete </button>
          </li>
        ))}
      </ul>
      {deletedTodos.length > 0 && <h2> Deleted To-Dos:</h2>}
      <ul>
        {deletedTodos.map((todo) => (
          <li key={todo.id}>
            <h3> {todo.title} </h3>
            <p>{todo.description}</p>
            <p>Due Date: {todo.dueDate} </p>
            <p>Priority:{todo.priority}</p>
            <button onClick={() => restoreTodo(todo.id)}> Restore </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
