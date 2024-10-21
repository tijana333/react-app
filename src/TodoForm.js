import React from "react";

function TodoForm({
  newTodo,
  handleChange,
  handleTitleChange,
  handleSubmit,
  errorMessage,
}) {
  return (
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
      <select name="priority" value={newTodo.priority} onChange={handleChange}>
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
  );
}

export default TodoForm;
