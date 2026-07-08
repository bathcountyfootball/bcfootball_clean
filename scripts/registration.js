// -----------------------------
// Add Player
// -----------------------------
let playerCount = 0;

function addPlayer() {
    playerCount++;

    const container = document.getElementById("playersContainer");

    const div = document.createElement("div");
    div.className = "player-card";
    div.id = `player-${playerCount}`;

    div.innerHTML = `
        <h3>Player ${playerCount}</h3>

        <label>Player Name</label>
        <input type="text" id="playerName-${playerCount}" required>

        <label>Player Age</label>
        <input type="number" id="playerAge-${playerCount}" required>

        <label>League</label>
        <select id="playerLeague-${playerCount}" required>
            <option value="">Select</option>
            <option value="Flag">Flag (Ages 5–7)</option>
            <option value="JrPro">Jr Pro (Ages 8–12)</option>
        </select>

        <label>Medical Notes</label>
        <textarea id="playerMedical-${playerCount}"></textarea>
    `;

    container.appendChild(div);
}

// -----------------------------
// Build Review Section
// -----------------------------
function buildReview() {
    const review = document.getElementById("reviewBox");
    review.innerHTML = "";

    const parentName = document.getElementById("parentName").value;
    const parentEmail = document.getElementById("parentEmail").value;
    const parentPhone = document.getElementById("parentPhone").value;

    review.innerHTML += `
        <h4>Parent</h4>
        <p><strong>Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Phone:</strong> ${parentPhone}</p>
        <hr>
    `;

    for (let i = 1; i <= playerCount; i++) {
        const name = document.getElementById(`playerName-${i}`).value;
        const age = document.getElementById(`playerAge-${i}`).value;
        const league = document.getElementById(`playerLeague-${i}`).value;
        const medical = document.getElementById(`playerMedical-${i}`).value;

        review.innerHTML += `
            <h4>Player ${i}</h4>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>League:</strong> ${league}</p>
            <p><strong>Medical Notes:</strong> ${medical}</p>
            <hr>
        `;
    }

    const plan = document.getElementById("paymentPlan").value;
    review.innerHTML += `<p><strong>Payment Plan:</strong> ${plan}</p>`;
}

// -----------------------------
// Submit & Pay
// -----------------------------
function submitRegistration() {

    // Validate parent fields
    if (!document.getElementById("parentName").value ||
        !document.getElementById("parentEmail").value ||
        !document.getElementById("parentPhone").value) {
        alert("Please complete parent information.");
        return;
    }

    // Validate players
    if (playerCount === 0) {
        alert("Please add at least one player.");
        return;
    }

    for (let i = 1; i <= playerCount; i++) {
        if (!document.getElementById(`playerName-${i}`).value ||
            !document.getElementById(`playerAge-${i}`).value ||
            !document.getElementById(`playerLeague-${i}`).value) {
            alert(`Please complete all fields for Player ${i}.`);
            return;
        }
    }

    // Validate payment plan
    const plan = document.getElementById("paymentPlan").value;
    if (!plan) {
        alert("Please select a payment plan.");
        return;
    }

    // -----------------------------
    // Pricing Logic
    // -----------------------------
    let totalFlag = 40;
    let totalJrPro = 60;

    let flagPlayers = 0;
    let jrPlayers = 0;

    for (let i = 1; i <= playerCount; i++) {
        const league = document.getElementById(`playerLeague-${i}`).value;

        if (league === "Flag") flagPlayers++;
        if (league === "JrPro") jrPlayers++;
    }

    // Calculate total
    let total = (flagPlayers * totalFlag) + (jrPlayers * totalJrPro);

    // Sibling discount only for Pay in Full
    if (plan === "full" && playerCount >= 2) {
        total -= 10;
    }

    // -----------------------------
    // Square Payment Redirect
    // -----------------------------
    let squareURL = "";

    if (plan === "full") {

        // If ALL players are Flag
        if (jrPlayers === 0) {
            squareURL = "https://square.link/u/1mXmf0Qd?src=sheet"; // Flag Pay in Full
        }

        // If ALL players are Jr Pro
        else if (flagPlayers === 0) {
            squareURL = "https://square.link/u/erwjam6I?src=sheet"; // Jr Pro Pay in Full
        }

        // Mixed leagues (Flag + Jr Pro)
        else {
            alert("Mixed leagues cannot use Pay in Full. Choose 2‑Payment Plan.");
            return;
        }
    }

    else if (plan === "plan") {

        // FLAG 2‑PAYMENT
        if (jrPlayers === 0) {
            alert("You will complete Payment 1 now. Payment 2 link will be emailed.");
            squareURL = "https://square.link/u/Dp5uuZbF?src=sheet"; // Flag Payment 1
        }

        // JR PRO 2‑PAYMENT
        else if (flagPlayers === 0) {
            alert("You will complete Payment 1 now. Payment 2 link will be emailed.");
            squareURL = "https://square.link/u/Vvt4QEPx?src=sheet"; // Jr Pro Payment 1
        }

        // Mixed leagues
        else {
            alert("Mixed leagues cannot use 2‑Payment Plan.");
            return;
        }
    }

    // Redirect to Square
    window.location.href = squareURL;
}


    // -----------------------------
    // Pricing Logic
    // -----------------------------
    let total = 0;

    for (let i = 1; i <= playerCount; i++) {
        const league = document.getElementById(`playerLeague-${i}`).value;

        if (league === "Flag") total += 40;
        if (league === "JrPro") total += 60;
    }

    // Sibling discount only for Pay in Full
    if (plan === "full" && playerCount >= 2) {
        total -= 10; // $10 off total
    }

    // -----------------------------
    // Square Payment Redirect
    // -----------------------------
    let squareURL = "";

    if (plan === "full") {
        squareURL = "https://checkout.square.site/pay-in-full-EXAMPLE?amount=" + total;
    } else {
        squareURL = "https://checkout.square.site/payment-plan-EXAMPLE?amount=" + total;
    }

    // Redirect to Square
    window.location.href = squareURL;
}
