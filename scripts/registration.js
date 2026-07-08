let playerCount = 0;

// Auto-calc age from birthdate
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

// Add Player
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

    // Auto-calc age
    const birthInput = document.getElementById(`playerBirthdate-${playerCount}`);
    const ageInput = document.getElementById(`playerAge-${playerCount}`);

    birthInput.addEventListener("change", () => {
        ageInput.value = calculateAgeFromBirthdate(birthInput.value);
    });

    // Physical popup
    const physicalSelect = document.getElementById(`playerPhysical-${playerCount}`);
    physicalSelect.addEventListener("change", () => {
        if (physicalSelect.value === "No") {
            alert("Jr Pro players must have a physical on file before participating.");
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

    review.innerHTML += `
        <h4>Parent</h4>
        <p><strong>Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Phone:</strong> ${parentPhone}</p>
        <p><strong>Address:</strong> ${parentAddress}</p>
        <hr>
    `;

    for (let i = 1; i <= playerCount; i++) {
        review.innerHTML += `
            <h4>Player ${i}</h4>
            <p><strong>Name:</strong> ${document.getElementById(`playerName-${i}`).value}</p>
            <p><strong>Birthdate:</strong> ${document.getElementById(`playerBirthdate-${i}`).value}</p>
            <p><strong>Age:</strong> ${document.getElementById(`playerAge-${i}`).value}</p>
            <p><strong>School:</strong> ${document.getElementById(`playerSchool-${i}`).value}</p>
            <p><strong>Grade:</strong> ${document.getElementById(`playerGrade-${i}`).value}</p>
            <p><strong>Gender:</strong> ${document.getElementById(`playerGender-${i}`).value}</p>
            <p><strong>League:</strong> ${document.getElementById(`playerLeague-${i}`).value}</p>
            <p><strong>Shirt Size:</strong> ${document.getElementById(`playerShirt-${i}`).value}</p>
            <p><strong>Doctor:</strong> ${document.getElementById(`playerDoctor-${i}`).value}</p>
            <p><strong>Doctor Phone:</strong> ${document.getElementById(`playerDoctorPhone-${i}`).value}</p>
            <p><strong>Medical:</strong> ${document.getElementById(`playerMedical-${i}`).value}</p>
            <p><strong>Physical On File:</strong> ${document.getElementById(`playerPhysical-${i}`).value}</p>
            <p><strong>Payment Type:</strong> ${document.getElementById(`playerPaymentType-${i}`).value}</p>
            <hr>
        `;
    }
}

// Submit & Pay
function submitRegistration() {

    // Validate parent
    if (!document.getElementById("parentName").value ||
        !document.getElementById("parentEmail").value ||
        !document.getElementById("parentPhone").value ||
        !document.getElementById("parentAddress").value) {
        alert("Please complete all parent information.");
        return;
    }

    if (playerCount === 0) {
        alert("Please add at least one player.");
        return;
    }

    let flagPlayers = 0;
    let jrPlayers = 0;
    let paymentTypeGlobal = null;

    for (let i = 1; i <= playerCount; i++) {

        const league = document.getElementById(`playerLeague-${i}`).value;
        const paymentType = document.getElementById(`playerPaymentType-${i}`).value;

        if (!league || !paymentType) {
            alert(`Please complete all fields for Player ${i}.`);
            return;
        }

        if (league === "Flag") flagPlayers++;
        if (league === "JrPro") jrPlayers++;

        if (paymentTypeGlobal === null) {
            paymentTypeGlobal = paymentType;
        } else if (paymentTypeGlobal !== paymentType) {
            alert("All players must use the same payment type.");
            return;
        }
    }

    const priceFlag = 40;
    const priceJrPro = 60;

    let total = (flagPlayers * priceFlag) + (jrPlayers * priceJrPro);

    if (paymentTypeGlobal === "full" && playerCount >= 2) {
        total -= 10;
    }

    let squareURL = "";

    if (paymentTypeGlobal === "full") {
        if (jrPlayers === 0) {
            squareURL = "https://square.link/u/1mXmf0Qd?src=sheet";
        } else if (flagPlayers === 0) {
            squareURL = "https://square.link/u/erwjam6I?src=sheet";
        } else {
            alert("Mixed leagues cannot use Pay in Full.");
            return;
        }
    }

    if (paymentTypeGlobal === "plan") {
        if (jrPlayers === 0) {
            alert("You will complete Payment 1 now.");
            squareURL = "https://square.link/u/Dp5uuZbF?src=sheet";
        } else if (flagPlayers === 0) {
            alert("You will complete Payment 1 now.");
            squareURL = "https://square.link/u/Vvt4QEPx?src=sheet";
        } else {
            alert("Mixed leagues cannot use 2-Payment Plan.");
            return;
        }
    }

    window.location.href = squareURL;
}
