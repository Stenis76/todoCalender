const todoListElement = document.querySelector(".todo-list");
const todoInputElement = document.querySelector(".add-todo-input");
const todoFormElement = document.querySelector(".add-todo-container");

const todos = [];

todoFormElement.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault(); // prevent refresh of page
  const input = todoInputElement.value;
  if (input) {
    addTodo(input);
    todoInputElement.value = "";
  }
}

function addTodo(todo) {
  todos.push(todo);

  const liElement = document.createElement("li");
  liElement.innerText = todo;
  todoListElement.appendChild(liElement);
}
