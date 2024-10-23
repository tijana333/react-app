import React from "react";

function TodoItem({ todo, deleteTodo, finishTodo, editTodo }) {
  const handleEdit = () => {
    if (editTodo) {
      editTodo(todo.id); // poziva editTodo sa ID-jem zadatka
    } else {
      console.error("editTodo function is not defined");
    }
  };

  return (
    <li>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <p>Due Date: {todo.dueDate}</p>
      <p>Priority: {todo.priority}</p>
      <button onClick={() => editTodo(todo)}>Edit</button>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      <button onClick={() => finishTodo(todo.id)}>Finish</button>
    </li>
  );
}

export default TodoItem;
