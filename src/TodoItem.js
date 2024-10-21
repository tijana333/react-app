import React from "react";

function TodoItem({ todo, onDelete, onFinish, onEdit }) {
  return (
    <li>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <p>Due Date: {todo.dueDate}</p>
      <p>Priority: {todo.priority}</p>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
      <button onClick={() => onFinish(todo.id)}>Finish</button>
    </li>
  );
}

export default TodoItem;