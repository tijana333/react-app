import React from "react";

function DeletedTodoList({ deletedTodos, restoreTodo }) {
  return (
    <>
      {deletedTodos.length > 0 && <h2> Deleted To-Dos:</h2>}
      <ul>
        {deletedTodos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Due Date: {todo.dueDate}</p>
            <p>Priority: {todo.priority}</p>
            <button onClick={() => restoreTodo(todo.id)}>Restore</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default DeletedTodoList;
