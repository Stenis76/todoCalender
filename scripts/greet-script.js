window.addEventListener("load", loadGreet);

function loadGreet() {
  const dayAndTime = new Date();
  toDayDate(dayAndTime);
  displayDate(dayAndTime);
  displayTime()
  setInterval(displayTime, 1000)
}

function toDayDate(dayAndTime) {
  let day = dayAndTime.getDay();

  switch (day) {
    case 0:
      day = "söndag";
      break;
    case 1:
      day = "måndag";
      break;
    case 2:
      day = "Tisdag";
      break;
    case 3:
      day = "Onsdag";
      break;
    case 4:
      day = "Torsdag";
      break;
    case 5:
      day = "Fredag";
      break;
    case 6:
      day = "Lördag";
      break;
  }
  document.getElementById("day-of-the-week").innerHTML = day;
}

function displayDate(dayAndTime) {
  const day = 1 + dayAndTime.getDay();
  const month = dayAndTime.getMonth();
  const monthName = getMonthName(month);
 
  document.querySelector(".todays-date").innerHTML = day + " " + monthName;
}

function displayTime() {
  const dayAndTime = new Date()
  const time = dayAndTime.toLocaleTimeString()
  document.querySelector(".time").innerHTML = time
}
