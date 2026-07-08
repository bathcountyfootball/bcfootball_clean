// -----------------------------
// Globals
// -----------------------------
let playerCount = 0;

// -----------------------------
// Utility: Calculate age from birthdate
// -----------------------------
function calculateAgeFromBirthdate(birthdateStr) {
    if (!birthdateStr) return "";
    const today = new Date();
    const dob = new Date(birthdateStr);
    if (isNaN(dob.getTime())) return "";

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// -----------------------------
// Add Player
// -----------------------------
function addPlayer() {
    playerCount++;

    const container = document.getElementById("playersContainer");

    const div = document.createElement("div");
    div.className = "player-card";
    div.id = `player-${playerCount}`;

    div.innerHTML = `
        <h4>Player ${playerCount}</h4>

        <label>Player Name</label>
        <input type="text" id="playerName-${playerCount}" required>

        <label>Birthdate</label>
        <input type="date" id="playerBirthdate-${playerCount}" required>

        <label>Age (auto-calculated)</label>
        <input type="number" id="playerAge-${playerCount}" readonly>

        <label>School</label>
        <input type="text" id="playerSchool-${playerCount}" required>

        <label>Grade</label>
        <input type="text" id="playerGrade-${playerCount}" required>

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
            <option value="Flag">Flag (Ages 5–7)</option>
            <option value="JrPro">Jr Pro (Ages 8–12)</option>
        </select>

        <label>Shirt Size</label>
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

        <label>Doctor Name</label>
        <input type="text" id="playerDoctor-${playerCount}" required>

        <label>Doctor Phone</label>
        <input type="tel" id="playerDoctorPhone-${playerCount}" required>

        <label>Allergies / Medical Conditions</label>
        <textarea id="playerMedical-${playerCount}"></textarea>

        <label>Jr Pro Physical On File?</label>
        <select id="playerPhysical-${playerCount}" required>
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>

        <label>Payment Type</label>
        <select id="playerPaymentType-${playerCount}" required>
            <option value="">Select</option>
            <option value="full">Pay in Full</option>
            <option value="plan">2-Payment Plan</option>
        </select>
    `;

    container.appendChild(div);

    // Auto-calc age when birthdate changes
    const birthInput = document.getElementById(`playerBirthdate-${playerCount}`);
    const ageInput = document.getElementById(`playerAge-${playerCount}`);

    birthInput.addEventListener("change", () => {
        const age = calculateAgeFromBirthdate(birthInput.value);
        ageInput.value = age || "";
    });

    // Jr Pro physical popup
    const physicalSelect = document.getElementById(`playerPhysical-${playerCount}`);
    physicalSelect.addEventListener("change", () => {
        if (physicalSelect.value === "No") {
            alert("Jr Pro players must have a physical on file before participating.");
        }
    });
}

// Attach Add Player button
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("addPlayerBtn");
    if (btn) {
        btn.addEventListener("click", addPlayer);
    }
});

// -----------------------------
// Build Review Section
// -----------------------------
function buildReview() {
    const review = document.getElementById("reviewBox");
    review.innerHTML = "";

    const parentName = document.getElementById("parentName").value;
    const parentEmail = document.getElementById("parentEmail").value;
    const parentPhone = document.getElementById("parentPhone").value;
    const parentAddress = document.getElementById("parentAddress").value;

    review.innerHTML += `
        <h4>Parent</h4>
        <p><strong>Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Phone:</strong> ${parentPhone}</p>
        <p><strong>Address:</strong> ${parentAddress}</p>
        <hr>
    `;

    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`playerName-${i}`).value;
        const birthdate = document.getElementById(`playerBirthdate-${i}`).value;
        const age = document.getElementById(`playerAge-${i}`).value;
        const school = document.getElementById(`playerSchool-${i}`).value;
        const grade = document.getElementById(`playerGrade-${i}`).value;
        const gender = document.getElementById(`playerGender-${i}`).value;
        const league = document.getElementById(`playerLeague-${i}`).value;
        const shirt = document.getElementById(`playerShirt-${i}`).value;
        const doctor = document.getElementById(`playerDoctor-${i}`).value;
        const doctorPhone = document.getElementById(`playerDoctorPhone-${i}`).value;
        const medical = document.getElementById(`playerMedical-${i}`).value;
        const physical = document.getElementById(`playerPhysical-${i}`).value;
        const paymentType = document.getElementById(`playerPaymentType-${i}`).value;

        review.innerHTML += `
            <h4>Player ${i}</h4>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Birthdate:</strong> ${birthdate}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>School:</strong> ${school}</p>
            <p><strong>Grade:</strong> ${grade}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>League:</strong> ${league}</p>
            <p><strong>Shirt Size:</strong> ${shirt}</p>
            <p><strong>Doctor:</strong> ${doctor}</p>
            <p><strong>Doctor Phone:</strong> ${doctorPhone}</p>
            <p><strong>Allergies / Medical:</strong> ${medical}</p>
            <p><strong>Physical On File:</strong> ${physical}</p>
            <p><strong>Payment Type:</strong> ${paymentType}</p>
            <hr>
        `;
    }
}

// -----------------------------
// Submit & Pay
// -----------------------------
function submitRegistration() {

    // Validate parent fields
    if (!document.getElementById("parentName").value ||
        !document.getElementById("parentEmail").value ||
        !document.getElementById("parentPhone").value ||
        !document.getElementById("parentAddress").value) {
        alert("Please complete all parent information.");
        return;
    }

    // Validate players
    if (playerCount === 0) {
        alert("Please add at least one player.");
        return;
    }

    let flagPlayers = 0;
    let jrPlayers = 0;

    let paymentTypeGlobal = null;

    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`playerName-${i}`).value;
        const birthdate = document.getElementById(`playerBirthdate-${i}`).value;
        const age = document.getElementById(`playerAge-${i}`).value;
        const school = document.getElementById(`playerSchool-${i}`).value;
        const grade = document.getElementById(`playerGrade-${i}`).value;
        const gender = document.getElementById(`playerGender-${i}`).value;
        const league = document.getElementById(`playerLeague-${i}`).value;
        const shirt = document.getElementById(`playerShirt-${i}`).value;
        const doctor = document.getElementById(`playerDoctor-${i}`).value;
        const doctorPhone = document.getElementById(`playerDoctorPhone-${i}`).value;
        const physical = document.getElementById(`playerPhysical-${i}`).value;
        const paymentType = document.getElementById(`playerPaymentType-${i}`).value;

        if (!name || !birthdate || !age || !school || !grade || !gender ||
            !league || !shirt || !doctor || !doctorPhone || !physical || !paymentType) {
            alert(`Please complete all fields for Player ${i}.`);
            return;
        }

        if (league === "Flag") flagPlayers++;
        if (league === "JrPro") jrPlayers++;

        // Ensure all players use same payment type
        if (paymentTypeGlobal === null) {
            paymentTypeGlobal = paymentType;
        } else if (paymentTypeGlobal !== paymentType) {
            alert("All players must use the same payment type (Pay in Full or 2-Payment Plan).");
            return;
        }
    }

    if (!paymentTypeGlobal) {
        alert("Please select payment type for all players.");
        return;
    }

    // -----------------------------
    // Pricing Logic
    // -----------------------------
    const priceFlag = 40;
    const priceJrPro = 60;

    let total = (flagPlayers * priceFlag) + (jrPlayers * priceJrPro);

    // Sibling discount only for Pay in Full
    if (paymentTypeGlobal === "full" && playerCount >= 2) {
        total -= 10;
    }

    // -----------------------------
    // Square Payment Redirect
    // -----------------------------
    let squareURL = "";

    if (paymentTypeGlobal === "full") {

        // All Flag
        if (jrPlayers === 0) {
            squareURL = "https://square.link/u/1mXmf0Qd?src=sheet"; // Flag Pay in Full
        }
        // All Jr Pro
        else if (flagPlayers === 0) {
            squareURL = "https://square.link/u/erwjam6I?src=sheet"; // Jr Pro Pay in Full
        }
        // Mixed leagues
        else {
            alert("Mixed leagues cannot use Pay in Full. Choose 2-Payment Plan or separate registrations.");
            return;
        }
    } else if (paymentTypeGlobal === "plan") {

        // All Flag
        if (jrPlayers === 0) {
            alert("You will complete Payment 1 now. Payment 2 link will be provided separately.");
            squareURL = "https://square.link/u/Dp5uuZbF?src=sheet"; // Flag 2-Payment, Payment 1
        }
        // All Jr Pro
        else if (flagPlayers === 0) {
            alert("You will complete Payment 1 now. Payment 2 link will be provided separately.");
            squareURL = "https://square.link/u/Vvt4QEPx?src=sheet"; // Jr Pro 2-Payment, Payment 1
        }
        // Mixed leagues
        else {
            alert("Mixed leagues cannot use 2-Payment Plan. Use separate registrations.");
            return;
        }
    } else {
        alert("Unknown payment type.");
        return;
    }

    // Redirect to Square
    window.location.href = squareURL;
}
