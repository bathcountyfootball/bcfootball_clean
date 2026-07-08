// ----- FAMILY PAYMENT LINK -----
const FAMILY_PAYMENT_LINK =
  "https://checkout.square.site/merchant/MLCQ44R69JXHJ/checkout/347GSTHR43ZFCASNG7BHFWX3?src=sheet";

// ----- YOUR APPS SCRIPT ENDPOINT -----
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzQrgAYG45pcW1jg1HVuN8pwxjQwk3wa3CQPYGN8YwwdHH4T6qZb_CyR3_JDOaGiXG6/exec";

// ----- PRICING -----
const PRICES = {
  Flag: {
    full: 57.00,
    p1: 28.50,
    p2: 28.50,
    sibling5: 51.00,
    sibling10: 47.00
  },
  JrPro: {
    full: 77.50,
    p1: 38.75,
    p2: 38.75,
    sibling5: 72.00,
    sibling10: 67.00
  }
};

// Store players
let players = [];

// ----- ADD PLAYER -----
function addPlayer() {
  const index = players.length;
  players.push({});

  const container = document.getElementById("playersContainer");

  const block = document.createElement("div");
  block.innerHTML = `
    <div class="accordion" onclick="togglePanel(${index})">
      Player ${index + 1}
    </div>

    <div class="panel" id="panel-${index}">
      <label>Player Name</label>
      <input type="text" id="playerName-${index}" required>

      <label>Birthdate</label>
      <input type="date" id="birthdate-${index}" required>

      <label>School</label>
      <input type="text" id="school-${index}" required>

      <label>Grade</label>
      <input type="number" id="grade-${index}" required>

      <label>Gender</label>
      <select id="gender-${index}" required>
        <option value="">Select</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      <label>League</label>
      <select id="league-${index}" required>
        <option value="">Select</option>
        <option value="Flag">Flag</option>
        <option value="Jr Pro">Jr Pro</option>
      </select>

      <label>Shirt Size</label>
      <select id="shirtSize-${index}" required>
        <option value="">Select</option>
        <option>YS</option>
        <option>YM</option>
        <option>YL</option>
        <option>YXL</option>
      </select>

      <h4>Medical Info</h4>

      <label>Doctor Name</label>
      <input type="text" id="doctorName-${index}" required>

      <label>Doctor Phone</label>
      <input type="tel" id="doctorPhone-${index}" required>

      <label>Allergies / Notes</label>
      <textarea id="allergies-${index}"></textarea>
    </div>
  `;

  container.appendChild(block);
}

// ----- TOGGLE ACCORDION -----
function togglePanel(i) {
  const panel = document.getElementById(`panel-${i}`);
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

// ----- BUILD REVIEW -----
function buildReview() {
  const review = document.getElementById("reviewBox");

  const parentName = document.getElementById("parentName").value;
  const parentEmail = document.getElementById("parentEmail").value;
  const parentPhone = document.getElementById("parentPhone").value;

  let html = `
    <h4>Parent</h4>
    <p><strong>Name:</strong> ${parentName}</p>
    <p><strong>Email:</strong> ${parentEmail}</p>
    <p><strong>Phone:</strong> ${parentPhone}</p>
    <hr>
  `;

  players.forEach((_, i) => {
    html += `
      <h4>Player ${i + 1}</h4>
      <p><strong>Name:</strong> ${document.getElementById(`playerName-${i}`).value}</p>
      <p><strong>Birthdate:</strong> ${document.getElementById(`birthdate-${i}`).value}</p>
      <p><strong>School:</strong> ${document.getElementById(`school-${i}`).value}</p>
      <p><strong>Grade:</strong> ${document.getElementById(`grade-${i}`).value}</p>
      <p><strong>Gender:</strong> ${document.getElementById(`gender-${i}`).value}</p>
      <p><strong>League:</strong> ${document.getElementById(`league-${i}`).value}</p>
      <p><strong>Shirt Size:</strong> ${document.getElementById(`shirtSize-${i}`).value}</p>

      <h4>Medical</h4>
      <p><strong>Doctor:</strong> ${document.getElementById(`doctorName-${i}`).value}</p>
      <p><strong>Doctor Phone:</strong> ${document.getElementById(`doctorPhone-${i}`).value}</p>
      <p><strong>Allergies:</strong> ${document.getElementById(`allergies-${i}`).value}</p>
      <hr>
    `;
  });

  review.innerHTML = html;
}

// ----- SUBMIT -----
function submitRegistration() {
  const parentName = document.getElementById("parentName").value;
  const parentEmail = document.getElementById("parentEmail").value;
  const parentPhone = document.getElementById("parentPhone").value;

  const paymentPlan = document.getElementById("paymentPlan").value;

  // Build players array
  const allPlayers = players.map((_, i) => ({
    playerName: document.getElementById(`playerName-${i}`).value,
    birthdate: document.getElementById(`birthdate-${i}`).value,
    school: document.getElementById(`school-${i}`).value,
    grade: document.getElementById(`grade-${i}`).value,
    gender: document.getElementById(`gender-${i}`).value,
    league: document.getElementById(`league-${i}`).value,
    shirtSize: document.getElementById(`shirtSize-${i}`).value,
    doctorName: document.getElementById(`doctorName-${i}`).value,
    doctorPhone: document.getElementById(`doctorPhone-${i}`).value,
    allergies: document.getElementById(`allergies-${i}`).value
  }));

  // ----- CALCULATE TOTAL -----
  let total = 0;

  allPlayers.forEach((p, i) => {
    const league = p.league;

    if (paymentPlan === "full") {
      // Sibling discount applies ONLY to full-pay
      if (i === 0) {
        total += PRICES[league].full;
      } else {
        // Apply $5 or $10 discount based on your rules
        // You can adjust this logic if needed
        total += PRICES[league].sibling10; // using $10 off for additional siblings
      }
    } else {
      // Payment plan
      total += PRICES[league].p1; // Payment 1 only
    }
  });

  // Save total for Family Payment page
  localStorage.setItem("familyTotal", total);

  // Save registration to Apps Script
  const payload = {
    action: "saveMultiRegistration",
    parentName,
    parentEmail,
    parentPhone,
    paymentPlan,
    players: allPlayers
  };

  fetch(SHEETS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // ALWAYS redirect to Family Payment link
  window.location.href = FAMILY_PAYMENT_LINK;
}
