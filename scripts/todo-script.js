const todoListElement = document.querySelector(".todo-list");
const todoInputElement = document.querySelector(".add-todo-input");
const todoFormElement = document.querySelector(".add-todo-container");

let selectedDate;
let todoLists = JSON.parse(localStorage.getItem("todoLists")) || {};

(function() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  selectedDate = year + "-" + month + "-" + day;
})();

if (todoLists[selectedDate]) renderTodos(todoLists[selectedDate]);

todoFormElement.addEventListener("submit", handleSubmit);
todoListElement.addEventListener("click", toggleDone);

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

  const todo = {
    id: new Date().getTime(),
    todoText: todoToAdd,
    done: false
  };

  todoLists[selectedDate].push(todo);
  renderTodos(todoLists[selectedDate]);

  localStorage.setItem("todoLists", JSON.stringify(todoLists));
  renderCalendar();
}

// bugg, filter tar bort likadana todos
function removeTodo(todoToRemove) {
  todoLists[selectedDate] = todoLists[selectedDate].filter(
    todo => todo.id !== todoToRemove.id
  );
  renderTodos(todoLists[selectedDate]);

  localStorage.setItem("todoLists", JSON.stringify(todoLists));
  renderCalendar();
}

function showEditModal(todo) {
  // View modal
  modalElement.style.display = "block";

  const form = document.querySelector(".modal form");
  const inputElement = document.querySelector(".modal input#editTodo");
  inputElement.value = todo.todoText;
  inputElement.focus();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const inputValue = inputElement.value;
    if (inputValue) {
      todo.todoText = inputValue;
      todo.done = false;
      localStorage.setItem("todoLists", JSON.stringify(todoLists));
      renderTodos(todoLists[selectedDate]);
      modalElement.style.display = "none";
    }
  });
}

function toggleDone(e) {
  if (!e.target.matches("input")) return;

  const inputElement = e.target;
  const index = inputElement.dataset.index;

  const selectedList = todoLists[selectedDate];

  selectedList[index].done = !selectedList[index].done;

  renderTodos(todoLists[selectedDate]);

  localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

function renderTodos(todosToRender) {
  // reset ul list
  todoListElement.innerHTML = "";

  todosToRender.forEach((todo, i) => {
    const liElement = document.createElement("li");
    const labelElement = document.createElement("label");
    labelElement.htmlFor = `todo-${i}`;
    const inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.checked = todo.done ? "checked" : "";
    inputElement.id = `todo-${i}`;
    inputElement.dataset.index = i;

    labelElement.innerText = todo.todoText;
    todo.done
      ? labelElement.classList.add("done")
      : labelElement.classList.remove("done");

    const inputContainer = document.createElement("span");
    inputContainer.appendChild(inputElement);
    liElement.appendChild(inputContainer);
    liElement.appendChild(labelElement);

    const buttonContainer = document.createElement("div");
    liElement.appendChild(buttonContainer);

    const editButton = document.createElement("span");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener("click", () => showEditModal(todo));
    buttonContainer.appendChild(editButton);

    const removeButton = document.createElement("span");
    removeButton.innerHTML = '<i class="fas fa-minus-circle"></i>';
    removeButton.addEventListener("click", () => removeTodo(todo));
    buttonContainer.appendChild(removeButton);

    todoListElement.appendChild(liElement);
  });
}

function handleDayClick(date, liElement) {
  liElement.classList.toggle("black");
  selectedDate = date;
  if (!todoLists[selectedDate]) {
    todoLists[selectedDate] = [];
  }
  renderTodos(todoLists[selectedDate]);
}
