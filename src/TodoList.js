import React from "react";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

function TodoList({ todos, editTodo, deleteTodo, finishTodo }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editTodo={editTodo}
          deleteTodo={deleteTodo}
          finishTodo={finishTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
