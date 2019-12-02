const todoListElement = document.querySelector(".todo-list");
const todoInputElement = document.querySelector(".add-todo-input");
const todoFormElement = document.querySelector(".add-todo-container");

const date = new Date();
const year =  date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate() ;


let selectedDate = year + "-" + month + "-" + day;


let todoLists = {
 
}

todoFormElement.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault(); // prevent refresh of page
  const input = todoInputElement.value;
  if (input) {
    addTodo(input);
    todoInputElement.value = "";
  }
}

function addTodo(todoToAdd) {
  if (!todoLists[selectedDate]) {
    todoLists[selectedDate] = [];
  }
  todoLists[selectedDate].push(todoToAdd);
  renderTodos(todoLists[selectedDate]);
}

function removeTodo(todoToRemove) {
  todoLists[selectedDate] = todoLists[selectedDate].filter(todo => todo !== todoToRemove);
  renderTodos(todoLists[selectedDate]);
}

function renderTodos(todosToRender) {
  
  console.log(todoLists);
  
  console.log(todosToRender);
  
  // reset ul list
  todoListElement.innerHTML = "";

  todosToRender.forEach(todo => {
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

function handleDayClick(date, liElement) {
  liElement.classList.toggle("black")
  selectedDate = date;
  if (!todoLists[selectedDate]) {
    todoLists[selectedDate] = [];
  }
  renderTodos(todoLists[selectedDate])


  
}

