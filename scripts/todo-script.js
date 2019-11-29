const todoListElement = document.querySelector(".todo-list");
const todoInputElement = document.querySelector(".add-todo-input");
const todoFormElement = document.querySelector(".add-todo-container");

let todos = [];

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
  renderTodos();
}

function removeTodo(todoToRemove) {
  todos = todos.filter(todo => todo !== todoToRemove);
  renderTodos();
}

function renderTodos() {
  // reset ul list
  todoListElement.innerHTML = "";

  todos.forEach(todo => {
    const liElement = document.createElement("li");
    const textElement = document.createElement("span");
    textElement.innerText = todo;
    liElement.appendChild(textElement);

    const button = document.createElement("button");
    button.innerText = "X";
    liElement.appendChild(button);
    button.addEventListener("click", () => removeTodo(todo));
    
    todoListElement.appendChild(liElement);
  });
}
