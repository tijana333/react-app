import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "low",
    createdAt: new Date().toISOString(),
    dueDate: "",
    status: "active",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    priority: "",
    status: "",
    date: "",
  });

  const [sortBy, setSortBy] = useState("creationDate");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedDeletedTodos =
      JSON.parse(localStorage.getItem("deletedTodos")) || [];
    setTodos(savedTodos);
    setDeletedTodos(savedDeletedTodos);
  }, []);

  {
    /*cuvanje podataka u local storage */
  }
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deletedTodos", JSON.stringify(deletedTodos));
  }, [todos, deletedTodos]);

  const addTodo = (newTodo) => {
    const todoToAdd = {
      id: Date.now(),
      ...newTodo,
    };
    setTodos((prev) => [...prev, todoToAdd]);
  };

  const editTodo = (todo) => {
    setCurrentTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
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
    setNewTodo({
      title: "",
      description: "",
      priority: "low",
      dueDate: "",
      status: "active",
    });
  };
  //izmena
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (currentTodo) {
      updateTodo(currentTodo.id);
    }
  };
  const deleteTodo = (id) => {
    const todoToDelete = todos.find((todo) => todo.id == id);
    setDeletedTodos((prev) => [
      ...prev,
      { ...todoToDelete, status: "trashed" },
    ]);
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

  const sortedTodos = () => {
    return todos.slice().sort((a, b) => {
      if (sortBy === "creationDate") {
        return a.id - b.id; //sortiranje po datumu
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
        {filteredAndSortedTodos().map((todo) => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Priority: {todo.priority}</p>
            <p>Created At: {new Date(todo.createdAt).toLocaleString()}</p>
            <p>Due Date: {todo.dueDate}</p>
            <select
              value={todo.status}
              onChange={(e) => updateStatus(todo.id, e.target.value)}
            >
              <option value="active">Active</option>
              <option value="finished">Finished</option>
            </select>
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
          <select
            name="priority"
            value={newTodo.priority}
            onChange={handleChange}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button type="submit">Update</button>
        </form>
      )}

      <h2>Deleted items:</h2>
      <ul>
        {deletedTodos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.description}
            <button onClick={() => restoreTodo(todo.id)}>Restore</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
