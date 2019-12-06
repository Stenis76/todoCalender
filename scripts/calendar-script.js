const calenderDaysElement = document.querySelector(".calendar-days");

let selectedCalendarDay;
let daysArray = [];

const date = {
  month: getPresentMonth(),
  year: getPresentYear()
};

function init() {
  createCalendar(date);

  document.getElementById("next-month").addEventListener("click", function() {
    increaseMonth(date);
  });
  document
    .getElementById("previous-month")
    .addEventListener("click", function() {
      decreaseMonth(date);
    });
}

async function createCalendar(date) {
  createCalendarHead(date);
  daysArray = await getMonth(date);
  

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  
  // check if we are viewing this month
  if (currentMonth === date.month) {
    const currentDay = currentDate.getDate();
    // .. then mark todays day so we can add a class to it during render
    daysArray[currentDay - 1].currentDay = true;
  }
  
  renderCalendar(daysArray);
}
function renderCalendar() {
  if (!daysArray.length) return;
  calenderDaysElement.innerHTML = "";
  let startDay = daysArray[0];
  let startDate = Number(startDay["dag i vecka"]);
  //Starting on 1 to get the start date correct with the days of the week, creates greyd days of the previous month (if there are any)
  let i = 1;
  while (i < startDate) {
    const liElement = createListElement();
    calenderDaysElement.appendChild(liElement);
    i++;
  }

  // Creates the days of the month
  for (let i = 0; i < daysArray.length; i++) {
    const day = daysArray[i];
    const liElement = createListElement(day);
    liElement.dataset.index = i;

    // if the day has todays date
    if (day.currentDay) {
      // .. default it to be selected
      selectedCalendarDay = liElement;
    }

    // if there is a selected day & that day's index match the index we're on
    if (selectedCalendarDay && selectedCalendarDay.dataset.index == i) {
      // .. set it to be the selected day
      selectedCalendarDay = liElement;
      selectedCalendarDay.classList.add("selected");
    }

    calenderDaysElement.appendChild(liElement);

    liElement.addEventListener("click", (e) => {
      handleDayClick(day.datum, liElement);
      if (selectedCalendarDay) selectedCalendarDay.classList.remove("selected");
      selectedCalendarDay = liElement;
      selectedCalendarDay.classList.add("selected");
      
      const month = +day.datum.split("-")[1];
      
      
    });
  }

  // Creates the days of the next month and fills them,
  let lastDay = daysArray[daysArray.length - 1];
  let lastDate = Number(lastDay["dag i vecka"]);
  let numberOfDaysToFill = 7 - lastDate;
  while (numberOfDaysToFill) {
    const liElement = createListElement();
    calenderDaysElement.appendChild(liElement);
    numberOfDaysToFill--;
  }
}

function createListElement(day) {
  const liElement = document.createElement("li");

  if (day) {
    // day.datum = 2019-11-27 String to Array to number
    const dateString = day.datum;
    const dateArray = dateString.split("-");
    const date = dateArray[2];
    const dateNumber = Number(date);
    
    const numberOfTodosElement = document.createElement("div");
    numberOfTodosElement.classList.add("number-of-todos");
    liElement.appendChild(numberOfTodosElement);

    if (todoLists[day.datum] && todoLists[day.datum].length > 0) {
      const numberOfTodos = todoLists[day.datum].length;
      numberOfTodosElement.innerText = "Todos " + numberOfTodos;
    }

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date");
    dateDiv.innerText = dateNumber;
    liElement.appendChild(dateDiv);

    const helgdagDiv = document.createElement("div");
    helgdagDiv.classList.add("holiday")
    liElement.appendChild(helgdagDiv);

    if (day["röd dag"] === "Ja") {
      liElement.style.color = "red";
      liElement.style.fontWeight = "bold";

      if (day.helgdag) {
        const helgdag = day.helgdag;
        helgdagDiv.innerText = helgdag;
      }
    } else if (day.helgdagsafton || day.helgdag) {
      const helgdag = day.helgdagsafton || day.helgdag;
      helgdagDiv.innerText = helgdag;
      liElement.appendChild(helgdagDiv);
    }
  } else {
    liElement.classList.add("day-fill")
  }
  return liElement;
}

async function getMonth(date) {
  try {
    const respons = await fetch(
      "https://api.dryg.net/dagar/v2.1/" + date.year + "/" + date.month
    );
    const data = await respons.json();
    return data.dagar;
  } catch (error) {
    console.error("GetMonth Failed to Fetch days", error);
    return [];
  }
}

function getMonthName(month) {
  switch (month) {
    case 1:
     return "januari";
    case 2:
     return "februari";
    case 3:
    return  "mars";
    case 4:
     return "april";
    case 5:
     return "maj";
    case 6:
    return  "juni";
    case 7:
    return  "juli";
    case 8:
    return  "augusti";
    case 9:
    return  "september";
    case 10:
     return "oktober";
    case 11:
    return  "november";
    case 12:
     return "december";
  }
}

function createCalendarHead(date) {
  const monthName = getMonthName(date.month)
  console.log(monthName);
  
  document.querySelector(".calendar-title").innerHTML =
    monthName + " " + date.year;
}

function getPresentMonth() {
  const dayAndTime = new Date();
  let month = dayAndTime.getMonth() + 1;
  return month;
}
function getPresentYear() {
  const dayAndTime = new Date();
  let year = dayAndTime.getFullYear();
  return year;
}

function increaseMonth(date) {
  date.month++;
  if (date.month > 12) {
    date.year++;
    date.month = 1;
  }
  selectedCalendarDay = "";
  createCalendar(date);
}

function decreaseMonth(date) {
  date.month--;
  if (date.month < 1) {
    date.year--;
    date.month = 12;
  }
  selectedCalendarDay = "";
  createCalendar(date);
}
init();
