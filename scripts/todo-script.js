const todoListElement = document.querySelector(".todo-list");

// object that stores all the todo lists for different dates.
// To retrieve a list for a particular date use a key with the 
// format "yyyy-mm-dd"
let todoLists;

// keep track of the selected date, default is the current date
let selectedDate;

let renderAll;

// IIFE ("iffy")
// Initialize the todo script 
(function() {
  // get the add todo container
  const todoFormElement = document.querySelector(".add-todo-container");
  // .. and listen to submits
  todoFormElement.addEventListener("submit", handleSubmit);
  
  // listen to click on the todo list element
  todoListElement.addEventListener("click", toggleDone);

  todoLists = JSON.parse(localStorage.getItem("todoLists")) || {};

  // get the selected date  from local storage or set the current date to the selected date
  selectedDate = localStorage.getItem("selectedDate") || getCurrentDateString();
 
  // set the todo header to the current day
  
  if (window.innerWidth <= 550) {
    renderAll = true;
    selectedDate = getCurrentDateString();
  }

  window.addEventListener("resize", e => {
    if (e.target.innerWidth <= 550) {
      renderAll = true;
      selectedDate = getCurrentDateString();
      renderTodos();
      setTodoHeaderDate(selectedDate);
    } else {
      renderAll = false;
      renderTodos();
      setTodoHeaderDate(selectedDate);
    }
  })

  setTodoHeaderDate(selectedDate);
  // if there is a list at the selectedDate key render that list
  // if (todoLists[selectedDate]) renderTodos(todoLists[selectedDate]);
  renderTodos();
})();

function getCurrentDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  return year + "-" + month + "-" + day;
}

function setTodoHeaderDate(dateString) {
  // get the todo header element
  const todoHeader = document.querySelector(".todo-list-header");

  if (renderAll) {
    todoHeader.innerText = "Att göra";
    return;
  }

  // split the dateString into and array
  const dateArray = dateString.split("-");
  
  // get the day from the array;
  const day = Number(dateArray[2]);

  // get the month from the array
  const month = Number(dateArray[1]);

  // get the name of the month
  const monthName = getMonthName(month);

  // update the todoHeaders text
  todoHeader.innerText = "Att göra den " + day + " " + monthName;
}

function handleSubmit(e) {
  e.preventDefault(); // prevent refresh of page
  // get the input element
  const todoInputElement = document.querySelector(".add-todo-input");

  // get the input value
  const input = todoInputElement.value;

  // if there was an input, create a todo with the input and clear
  // the input field
  if (input) {
    addTodo(input);
    todoInputElement.value = "";
  }
}

function addTodo(todoToAdd) {
  // if there is no list for the selected date create and empty array
  // in the state for the selected date
  if (!selectedDate) {
    selectedDate = getCurrentDateString();
  }
  
  if (!todoLists[selectedDate]) {
    todoLists[selectedDate] = [];
  }

  // create new todo
  const todo = {
    id: new Date().getTime(),
    todoText: todoToAdd,
    done: false
  };
  console.log(selectedDate);
  
  // add new todo to the state
  todoLists[selectedDate].push(todo);

  // render new state
  renderTodos();
  renderCalendar();

  // save state to local storage
  localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

function removeTodo(todoToRemove) {
  if(renderAll) {
    for(let key in todoLists) {
      todoLists[key] = todoLists[key].filter(todo => todo.id !== todoToRemove.id)
    }
    renderTodos();
    renderCalendar();
    return;
  }
  // filter out the todoToRemove from the array and update with new array
  todoLists[selectedDate] = todoLists[selectedDate].filter(
    todo => todo.id !== todoToRemove.id
  );

  // render new state
  renderTodos();
  renderCalendar();

  // save state to local storage
  localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

function editTodo(todo, newText) {
  // update the todo
  todo.todoText = newText;
  todo.done = false;

  // render new state
  renderTodos();

  // save the state to local storage
  localStorage.setItem("todoLists", JSON.stringify(todoLists));

  // close the modal
  modalElement.style.display = "none";
}

function showEditModal(todo) {
  // display modal
  modalElement.style.display = "block";

  // get the form and input elements
  const form = document.querySelector(".modal form");
  const inputElement = document.querySelector(".modal input#editTodo");

  // set the input value to the todo text
  inputElement.value = todo.todoText;

  // set the cursor to the input field
  inputElement.focus();

  // listen for submit events from the form
  form.addEventListener("submit", e => handelModalInput(e, todo, inputElement));
}

function handelModalInput(e, todo, inputElement) {
  // prevent refresh of page
  e.preventDefault();

  // get the users input
  const inputValue = inputElement.value;

  // if there's input edit the todo
  if (inputValue) {
    editTodo(todo, inputValue);
  }
}

function toggleDone(e) {
  // return function if target is not the checkbox
  if (!e.target.matches("input[type='checkbox']")) return;

  // save reference to the input element
  const inputElement = e.target;

  // get the index off the input elements dataset
  const index = inputElement.dataset.index;

  // get the todo list for the selected date
  const selectedList = todoLists[selectedDate];

  // target the todo with the index and toggle it's done property
  selectedList[index].done = !selectedList[index].done;

  // render new state
  renderTodos();

  // save state to local storage
  localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

function renderTodos() {
  // reset the ul container element
  todoListElement.innerHTML = "";

  if (renderAll) {
    renderAllTodos();
    return;
  }
  
  // get the todos for the selected date
  todosToRender = todoLists[selectedDate];
  
  // create a todo html element for every todo in the array
  todosToRender.forEach((todo, index) => {
    const todoElement = createTodoElement(todo, index);
    // .. and append them to the ul element
    todoListElement.appendChild(todoElement);
  });
}

function renderAllTodos() {
 
  let index = 0;
  Object.entries(todoLists).forEach(([key, todoList]) => {
    if (todoList.length) {
      const dayHeader = document.createElement("li");
      todoListElement.appendChild(dayHeader);
      dayHeader.innerHTML = `<h3>${key}</h3>`
      dayHeader.classList.add("todo-day-header")

    }
    todoList.forEach(todo => {
      const todoElement = createTodoElement(todo, index);
      todoListElement.appendChild(todoElement);
      index++;
    })
  })
}

function createTodoElement(todo, index) {
  // create a li element
  const todoElement = document.createElement("li");
  
  // create a input checkbox
  const inputElement = document.createElement("input");
  inputElement.type = "checkbox";

  // set the checkbox to be checked if the todos done property is true
  inputElement.checked = todo.done ? "checked" : "";
  
  // give the input element an index so we can keep track of the checkboxes
  inputElement.dataset.index = index;

  // create a label element
  const labelElement = document.createElement("label");

  // connect the label to the input checkbox
  labelElement.htmlFor = `todo-${index}`;

  // set the labels text to the todos text
  labelElement.innerText = todo.todoText;

  // depending on the todos done property
  // add or remove the done css class
  todo.done
    ? labelElement.classList.add("done")
    : labelElement.classList.remove("done");

  // create a span element to contain the checkbox
  const inputContainer = document.createElement("span");

  // add the checkbox to the container
  inputContainer.appendChild(inputElement);

  // add the checkbox container to the todo element
  todoElement.appendChild(inputContainer);

  // add the label to the todo element
  todoElement.appendChild(labelElement);

  // create a div element to container the buttons
  const buttonContainer = document.createElement("div");

  // add the button container to the todo element
  todoElement.appendChild(buttonContainer);

  // create a span element
  const editButton = document.createElement("span");

  // insert a i element icon into the span element
  editButton.innerHTML = '<i class="fas fa-edit"></i>';

  // listen to click on the span element
  editButton.addEventListener("click", () => showEditModal(todo));

  // add the span element to the button container
  buttonContainer.appendChild(editButton);

  // create a span element
  const removeButton = document.createElement("span");

  // insert a i element icon into the span element
  removeButton.innerHTML = '<i class="fas fa-minus-circle"></i>';

  // listen to click on the span element
  removeButton.addEventListener("click", () => removeTodo(todo));

  // add the span element to the button container
  buttonContainer.appendChild(removeButton);

  return todoElement;
}

function handleDayClick(date) {
  if (!date) {
    renderAll = true;
    selectedDate = date;
    setTodoHeaderDate(date);
    renderTodos();
    return;
  }
  
  renderAll = false;
  // update the selected date
  selectedDate = date;
  localStorage.setItem("selectedDate", selectedDate);
  // if there is no list for the selected date create and empty array
  // in the state for the selected date
  if (!todoLists[selectedDate]) {
    todoLists[selectedDate] = [];
  }

  // set the todo header to the selected date
  setTodoHeaderDate(selectedDate);

  // render todos for the selected date
  renderTodos();
}


