import React, { useState, useEffect } from "react";
import "./App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import FinishedTodoList from "./FinishedTodoList";
import DeletedTodoList from "./DeletedTodoList";
import SearchBar from "./SearchBar";

function App() {
  const [todos, setTodos] = useState([]);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [finishedTodos, setFinishedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "low",
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
    const savedFinishedTodos =
      JSON.parse(localStorage.getItem("finishedTodos")) || [];
    setTodos(savedTodos);
    setDeletedTodos(savedDeletedTodos);
    setFinishedTodos(savedFinishedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("deletedTodos", JSON.stringify(deletedTodos));
    localStorage.setItem("finishedTodos", JSON.stringify(finishedTodos));
  }, [todos, deletedTodos, finishedTodos]);

  const validateForm = () => {
    if (!newTodo.title || !newTodo.description || !newTodo.dueDate) {
      setErrorMessage("Please fill out all fields.");
      return false;
    }

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
  };

  const addTodo = (newTodo) => {
    const todoToAdd = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...newTodo,
    };
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
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "active" } : todo
    );
    setTodos(updatedTodos);
  };

  const restoreTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, status: "active" } : todo
    );
    setTodos(updatedTodos);
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

  const filteredAndSortedTodos = () => {
    return todos
      .filter((todo) => {
        if (filterBy === "active") return todo.status === "active";
        if (filterBy === "finished") return todo.status === "finished";
        if (filterBy === "trashed") return todo.status === "trashed";
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "creationDate") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "priority") {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sortBy === "status") {
          const statusOrder = { active: 1, finished: 2, trashed: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return 0;
      });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <TodoForm
        newTodo={newTodo}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
        editMode={editMode}
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />
      <TodoList
        todos={filteredAndSortedTodos()}
        editTodo={editTodo}
        deleteTodo={deleteTodo}
        finishTodo={finishTodo}
      />
      <FinishedTodoList
        finishedTodos={finishedTodos}
        restoreFinishedTodo={restoreFinishedTodo}
        deleteTodo={deleteTodo}
      />
      <DeletedTodoList deletedTodos={deletedTodos} restoreTodo={restoreTodo} />
    </div>
  );
}

export default App;
