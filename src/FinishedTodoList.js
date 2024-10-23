import React from "react";
import TodoItem from "./TodoItem";

const FinishedTodoList = ({
  finishedTodos,
  restoreFinishedTodo,
  deleteTodo,
}) => {
  return (
    <ul>
      {finishedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editTodo={null}
          deleteTodo={deleteTodo}
          finishTodo={restoreFinishedTodo}
        />
      ))}
    </ul>
  );
};

export default FinishedTodoList;
