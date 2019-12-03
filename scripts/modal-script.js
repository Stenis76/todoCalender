const modalElement = document.querySelector(".modal");


// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
const span = document.querySelector(".close");

// When the user clicks on the button, open the modal
// btn.onclick = function() {
//   modalElement.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modalElement.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modalElement.style.display = "none";
  }
}