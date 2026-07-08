let playerCount = 0;

// Calculate age from birthdate
function calculateAgeFromBirthdate(birthdateStr) {
  if (!birthdateStr) return "";
  const today = new Date();
  const dob = new Date(birthdateStr);
  if (isNaN(dob.getTime())) return "";
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// Add Player
function addPlayer() {
  playerCount++;
  const container = document.getElementById("playersContainer");

  const div = document.createElement("div");
  div.className = "player-card";
  div.id = `player-${playerCount}`;

  div.innerHTML = `
    <h4>Player ${playerCount}</h4>
    <label>Player Name</label>
    <input type="text" id="playerName-${playerCount}" required />

    <label>Birthdate</label>
    <input type="date" id="playerBirthdate-${playerCount}" required />

    <label>Age (auto‑calculated)</label>
    <input type="number" id="playerAge-${playerCount}" readonly />

    <label>School</label>
    <input type="text" id="playerSchool-${playerCount}" required />

    <label>Grade</label>
    <input type="text" id="playerGrade-${playerCount}" required />

    <label>Gender</label>
    <select id="playerGender-${playerCount}" required>
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    <label>League</label>
    <select id="playerLeague-${playerCount}" required>
      <option value="">Select</option>
      <option value="Flag">Flag (Ages 5–7)</option>
      <option value="JrPro">Jr Pro (Ages 8–12)</option>
    </select>

    <label>Shirt Size</label>
    <select id="playerShirt-${playerCount}" required>
      <option value="">Select</option>
      <option value="YS">YS</option>
      <option value="YM">YM</option>
      <option value="YL">YL</option>
      <option value="YXL">YXL</option>
      <option value="AS">AS</option>
      <option value="AM">AM</option>
      <option value="AL">AL</option>
      <option value="AXL">AXL</option>
      <option value="A2XL">A2XL</option>
      <option value="A3XL">A3XL</option>
    </select>

    <label>Doctor Name</label>
    <input type="text" id="playerDoctor-${playerCount}" required />

    <label>Doctor Phone</label>
    <input type="tel" id="playerDoctorPhone-${playerCount}" required />

    <label>Allergies / Medical Conditions</label>
    <textarea id="playerMedical-${playerCount}"></textarea>

    <label>Jr Pro Physical On File?</label>
    <select id="playerPhysical-${playerCount}" required>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  `;

  container.appendChild(div);

  // Auto‑calc age
  const birthInput = document.getElementById(`playerBirthdate-${playerCount}`);
  const ageInput = document.getElementById(`playerAge-${playerCount}`);
  birthInput.addEventListener("change", () => {
    ageInput.value = calculateAgeFromBirthdate(birthInput.value);
  });

  // Physical popup
  const physicalSelect = document.getElementById(`playerPhysical-${playerCount}`);
  physicalSelect.addEventListener("change", () => {
    if (physicalSelect.value === "No") {
      alert("Jr Pro players must have a physical on file before participating.");
    }
  });
}

// Build Review
function buildReview() {
  const review = document.getElementById("reviewBox");
  review.innerHTML = "";

  const parentName = document.getElementById("parentName").value;
  const parentEmail = document.getElementById("parentEmail").value;
  const parentPhone = document.getElementById("parentPhone").value;
  const parentAddress = document.getElementById("parentAddress").value;
