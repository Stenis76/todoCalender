const calenderDaysElement = document.querySelector(".calendar-days");

async function init() {
  let month = getPresentMonth() 
  let year = getPresentYear()
  const daysArray = await getMonth(year, month);
  let startDay = daysArray[0];
  let startDate = Number(startDay["dag i vecka"]);
  createCalendarHead(year, month)
  

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
    calenderDaysElement.appendChild(liElement);

    liElement.addEventListener("click", () => {
      handleDayClick(day.datum, liElement)
    })
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
    liElement.style.backgroundColor = "#dadada";
  }
  return liElement;
}

async function getMonth(year, month) {
  try {
    const respons = await fetch(
      "https://api.dryg.net/dagar/v2.1/" + year + "/" + month
    );
    const data = await respons.json();
    return data.dagar;
  } catch (error) {
    console.error("GetMonth Failed to Fetch days", error);
    return [];
  }
}

function createCalendarHead(year, month) {

  switch (month) {
    case 1:
        month = "januari";
        break;
    case 2:
        month = "februari";
        break;
    case 3:
        month = "mars";
        break;
    case 4:
        month = "april";
        break;
    case 5:
        month = "maj";
        break;
    case 6:
        month = "juni";
        break;
    case 7:
        month = "juli";
        break;
    case 8:
        month = "augusti";
        break;
    case 9:
        month = "september"
        break;
    case 10:
        month = "oktober"
        break;
    case 11:
        month = "november"
        break;
    case 12:
        month = "december"
        break;
      }
      document.querySelector(".calendar-title").innerHTML = "Härliga " + month + " " + year;
}

function getPresentMonth() {
  const dayAndTime = new Date()
  let month = dayAndTime.getMonth() + 1
  return month
}
function getPresentYear(){
  const dayAndTime = new Date()
  let year = dayAndTime.getFullYear()
  return year
}

init();
