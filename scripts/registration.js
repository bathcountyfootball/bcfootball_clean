// =====================================================
// Bath County Football Registration
// registration.js - Part 1
// =====================================================

let playerCount = 0;

// -----------------------------
// Wait until page loads
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("addPlayerBtn")
        .addEventListener("click", addPlayer);

    document
        .getElementById("reviewBtn")
        .addEventListener("click", buildReview);

    document
        .getElementById("submitBtn")
        .addEventListener("click", submitRegistration);

    // Start with one player already visible
    addPlayer();

});


// -----------------------------
// Calculate Age
// -----------------------------
function calculateAge(dateString) {

    if (!dateString) return "";

    const today = new Date();
    const birth = new Date(dateString);

    let age = today.getFullYear() - birth.getFullYear();

    const month = today.getMonth() - birth.getMonth();

    if (
        month < 0 ||
        (month === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age;

}


// -----------------------------
// Add Player Card
// -----------------------------
function addPlayer() {

    playerCount++;

    const container = document.getElementById("playersContainer");

    const card = document.createElement("div");

    card.className = "player-card";

    card.id = "playerCard" + playerCount;

    card.innerHTML = `

<h3>Player ${playerCount}</h3>

<label>Player Name</label>
<input
type="text"
id="playerName${playerCount}"
required>

<label>Birthdate</label>
<input
type="date"
id="playerBirthdate${playerCount}"
required>

<label>Age</label>
<input
type="number"
id="playerAge${playerCount}"
readonly>

<label>School</label>
<input
type="text"
id="playerSchool${playerCount}"
required>

<label>Grade</label>
<input
type="text"
id="playerGrade${playerCount}"
required>

<label>Gender</label>

<select id="playerGender${playerCount}" required>

<option value="">Select</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>


<label>League</label>

<select
id="playerLeague${playerCount}"
required>

<option value="">Select</option>

<option value="Flag">
Flag Football
</option>

<option value="Jr Pro">
Jr Pro
</option>

</select>


<label>Shirt Size</label>

<select
id="playerShirt${playerCount}"
required>

<option value="">Select</option>

<option>YS</option>
<option>YM</option>
<option>YL</option>
<option>YXL</option>

<option>AS</option>
<option>AM</option>
<option>AL</option>
<option>AXL</option>
<option>A2XL</option>
<option>A3XL</option>

</select>


<label>Doctor Name</label>

<input
type="text"
id="playerDoctor${playerCount}"
required>


<label>Doctor Phone</label>

<input
type="tel"
id="playerDoctorPhone${playerCount}"
required>


<label>Medical Conditions / Allergies</label>

<textarea
id="playerMedical${playerCount}">
</textarea>


<label>Physical On File?</label>

<select
id="playerPhysical${playerCount}"
required>

<option value="">Select</option>
<option>Yes</option>
<option>No</option>

</select>

<button
type="button"
class="btn removeBtn"
data-player="${playerCount}">
Remove Player
</button>

`;

    container.appendChild(card);

    // -----------------------------
    // Birthdate Event
    // -----------------------------

    const birth = document.getElementById("playerBirthdate" + playerCount);

    const age = document.getElementById("playerAge" + playerCount);

    const league = document.getElementById("playerLeague" + playerCount);

    birth.addEventListener("change", () => {

        const years = calculateAge(birth.value);

        age.value = years;

        // Automatically suggest league

        if (years >= 5 && years <= 7) {

            league.value = "Flag";

        }

        else if (years >= 8 && years <= 12) {

            league.value = "Jr Pro";

        }

        else {

            league.value = "";

            alert(
                "Player age is outside the normal registration range."
            );

        }

    });


    // -----------------------------
    // Physical Alert
    // -----------------------------

    const physical = document.getElementById(
        "playerPhysical" + playerCount
    );

    physical.addEventListener("change", () => {

        if (
            league.value === "Jr Pro" &&
            physical.value === "No"
        ) {

            alert(
                "Jr Pro players must have a physical on file before participating."
            );

        }

    });


    // -----------------------------
    // Remove Button
    // -----------------------------

    const removeBtn = card.querySelector(".removeBtn");

    removeBtn.addEventListener("click", () => {

        if (confirm("Remove this player?")) {

            card.remove();

            buildReview();

        }

    });

}
// =====================================================
// registration.js - Part 2
// =====================================================


// -----------------------------
// Build Review
// -----------------------------
function buildReview() {

    const review = document.getElementById("reviewBox");

    let html = "";

    html += "<h3>Parent Information</h3>";

    html += `<p><strong>Name:</strong> ${document.getElementById("parentName").value}</p>`;
    html += `<p><strong>Email:</strong> ${document.getElementById("parentEmail").value}</p>`;
    html += `<p><strong>Phone:</strong> ${document.getElementById("parentPhone").value}</p>`;
    html += `<p><strong>Address:</strong> ${document.getElementById("parentAddress").value}</p>`;

    html += "<hr>";

    const cards = document.querySelectorAll(".player-card");

    cards.forEach((card, index) => {

        const id = card.id.replace("playerCard","");

        html += `<h3>Player ${index + 1}</h3>`;

        html += `<p><strong>Name:</strong> ${document.getElementById("playerName"+id).value}</p>`;
        html += `<p><strong>Age:</strong> ${document.getElementById("playerAge"+id).value}</p>`;
        html += `<p><strong>School:</strong> ${document.getElementById("playerSchool"+id).value}</p>`;
        html += `<p><strong>Grade:</strong> ${document.getElementById("playerGrade"+id).value}</p>`;
        html += `<p><strong>Gender:</strong> ${document.getElementById("playerGender"+id).value}</p>`;
        html += `<p><strong>League:</strong> ${document.getElementById("playerLeague"+id).value}</p>`;
        html += `<p><strong>Shirt Size:</strong> ${document.getElementById("playerShirt"+id).value}</p>`;
        html += `<p><strong>Doctor:</strong> ${document.getElementById("playerDoctor"+id).value}</p>`;
        html += `<p><strong>Doctor Phone:</strong> ${document.getElementById("playerDoctorPhone"+id).value}</p>`;
        html += `<p><strong>Medical:</strong> ${document.getElementById("playerMedical"+id).value}</p>`;
        html += `<p><strong>Physical:</strong> ${document.getElementById("playerPhysical"+id).value}</p>`;

        html += "<hr>";

    });

    html += `<h3>Payment Plan</h3>`;
    html += `<p>${document.getElementById("paymentPlan").value}</p>`;

    review.innerHTML = html;

}



// -----------------------------
// Validate Form
// -----------------------------
function validateForm() {

    const form = document.getElementById("registrationForm");

    if (!form.checkValidity()) {

        form.reportValidity();

        return false;

    }

    if (document.querySelectorAll(".player-card").length === 0) {

        alert("Please add at least one player.");

        return false;

    }

    return true;

}



// -----------------------------
// Collect Registration Data
// -----------------------------
function collectRegistrationData() {

    const registration = {

        parent: {

            name: document.getElementById("parentName").value,

            email: document.getElementById("parentEmail").value,

            phone: document.getElementById("parentPhone").value,

            address: document.getElementById("parentAddress").value

        },

        paymentPlan: document.getElementById("paymentPlan").value,

        players: []

    };


    document.querySelectorAll(".player-card").forEach(card => {

        const id = card.id.replace("playerCard","");

        registration.players.push({

            name: document.getElementById("playerName"+id).value,

            birthdate: document.getElementById("playerBirthdate"+id).value,

            age: document.getElementById("playerAge"+id).value,

            school: document.getElementById("playerSchool"+id).value,

            grade: document.getElementById("playerGrade"+id).value,

            gender: document.getElementById("playerGender"+id).value,

            league: document.getElementById("playerLeague"+id).value,

            shirt: document.getElementById("playerShirt"+id).value,

            doctor: document.getElementById("playerDoctor"+id).value,

            doctorPhone: document.getElementById("playerDoctorPhone"+id).value,

            medical: document.getElementById("playerMedical"+id).value,

            physical: document.getElementById("playerPhysical"+id).value

        });

    });

    return registration;

}



// -----------------------------
// Submit Registration
// -----------------------------
function submitRegistration() {

    if (!validateForm()) {

        return;

    }

    buildReview();

    const registration = collectRegistrationData();

    console.log("Registration Data");

    console.log(registration);

    alert(
        "Registration has been validated.\n\nThe data has been collected successfully.\n\nNext step: connect this function to Stripe, PayPal, Firebase, or your server."
    );

}