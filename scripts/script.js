/*
Student Name: Kristie Jones 
File Name: script.js
*/
const animatedText = document.getElementById('animatedText');
let colorIndex = 0;

function changeColor() {
    const colors = ['red', 'white']; // Add more colors as needed
    animatedText.style.color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
}

// Change text color every 1000 milliseconds (1 second)
setInterval(changeColor, 1000);

// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i;

// All images together
function one() {
    for (i = 0; i < elements.length; i++) {
    elements[i].style.msFlex = "100%";  // IE10
    elements[i].style.flex = "100%";
  }
}


// 3 columns side by side
function three() {
    for (i = 0; i < elements.length; i++) {
      elements[i].style.msFlex = "25%";  // IE10
      elements[i].style.flex = "25%";
    }
  }
  // Add active class to the current button (highlight it)
var header = document.getElementById("gridheader");
var btns = header.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

fetch("https://script.google.com/macros/s/AKfycbyOMuo_lz25nwPDsdu05ZJcOFqNhOAs-FNCOIRrwBSc8M32denbdQzyOw_9_aZN7zQp/exec", {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json"
  }
})


