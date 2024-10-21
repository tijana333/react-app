import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, onDelete, onFinish, onEdit }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onFinish={onFinish}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
