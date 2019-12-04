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

    if (selectedCalendarDay && selectedCalendarDay.dataset.index == i) {
      selectedCalendarDay = liElement;
      selectedCalendarDay.classList.add("active");
    }

    calenderDaysElement.appendChild(liElement);

    liElement.addEventListener("click", (e) => {
      handleDayClick(day.datum, liElement);
      if (selectedCalendarDay) selectedCalendarDay.classList.remove("active");
      selectedCalendarDay = liElement;
      selectedCalendarDay.classList.add("active");
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

    const dateDiv = document.createElement("div");
    dateDiv.innerText = dateNumber;
    liElement.appendChild(dateDiv);

    if (todoLists[day.datum] && todoLists[day.datum].length > 0) {
      const numberOfTodos = todoLists[day.datum].length;
      const numberOfTodosElement = document.createElement("div");
      numberOfTodosElement.classList.add("number-of-todos");
      numberOfTodosElement.innerText = "Todos " + numberOfTodos;
      liElement.appendChild(numberOfTodosElement);
    }

    if (day["röd dag"] === "Ja") {
      liElement.style.color = "red";
      liElement.style.fontWeight = "bold";

      if (day.helgdag) {
        const helgdag = day.helgdag;
        const helgdagDiv = document.createElement("div");
        helgdagDiv.innerText = helgdag;
        liElement.appendChild(helgdagDiv);
      }
    } else if (day.helgdagsafton || day.helgdag) {
      const helgdag = day.helgdagsafton || day.helgdag;
      const helgdagDiv = document.createElement("div");
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

function createCalendarHead(date) {
  let monthName = date.month;
  switch (monthName) {
    case 1:
      monthName = "januari";
      break;
    case 2:
      monthName = "februari";
      break;
    case 3:
      monthName = "mars";
      break;
    case 4:
      monthName = "april";
      break;
    case 5:
      monthName = "maj";
      break;
    case 6:
      monthName = "juni";
      break;
    case 7:
      monthName = "juli";
      break;
    case 8:
      monthName = "augusti";
      break;
    case 9:
      monthName = "september";
      break;
    case 10:
      monthName = "oktober";
      break;
    case 11:
      monthName = "november";
      break;
    case 12:
      monthName = "december";
      break;
  }
  document.querySelector(".calendar-title").innerHTML =
    "Härliga " + monthName + " " + date.year;
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
