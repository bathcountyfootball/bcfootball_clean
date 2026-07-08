// ----- CONFIG: SQUARE LINKS -----
const SQUARE_LINKS = {
    Flag: {
        full: "https://square.link/u/1mXmf0Qd?src=sheet",
        split1: "https://square.link/u/Dp5uuZbF?src=sheet",
        split2: "https://square.link/u/uEwaB8fa?src=sheet"
    },
    "Jr Pro": {
        full: "https://square.link/u/erwjam6I?src=sheet",
        split1: "https://square.link/u/Vvt4QEPx?src=sheet",
        split2: "https://square.link/u/YmwuYeY8?src=sheet"
    }
};

const PAYMENT2_DUE_DISPLAY = "August 7";

// Your actual Apps Script endpoint
const SHEETS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxnIbz_eMUCwMyCa52oZbJTbC6PRb77FDKG6g6CMPTHt9sOd53SYd5lceIca0xH96wpBg/exec";

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

    const payload = {
        action: "saveMultiRegistration",
        parentName,
        parentEmail,
        parentPhone,
        paymentPlan,
        payment2Due: PAYMENT2_DUE_DISPLAY,
        players: allPlayers
    };

    fetch(SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    // Payment redirect (based on first player's league)
    const leagueKey = allPlayers[0].league;
    const redirectUrl =
        paymentPlan === "full"
            ? SQUARE_LINKS[leagueKey].full
            : SQUARE_LINKS[leagueKey].split1;

    window.location.href = redirectUrl;
}
