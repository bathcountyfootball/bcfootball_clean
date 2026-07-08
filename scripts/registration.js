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

// Payment 2 due date (display only)
const PAYMENT2_DUE_DISPLAY = "August 7";

// ----- WIZARD STATE -----
let currentStep = 1;

// ----- INIT -----
document.addEventListener("DOMContentLoaded", () => {
    showStep(currentStep);
    autoFillParentInfo();
});

// ----- STEP NAVIGATION -----
function showStep(step) {
    const steps = document.querySelectorAll(".step");
    steps.forEach((s, index) => {
        s.classList.toggle("active", index + 1 === step);
    });

    // Button visibility control
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    if (step === 5) {
        // Final step — only show Submit & Pay
        if (backBtn) backBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
        if (submitBtn) submitBtn.style.display = "inline-block";
    } else {
        // Steps 1–4 — show Back/Next, hide Submit
        if (backBtn) backBtn.style.display = "inline-block";
        if (nextBtn) nextBtn.style.display = "inline-block";
        if (submitBtn) submitBtn.style.display = "none";
    }
}


function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        if (currentStep === 5) buildReview();
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// ----- AUTO-FILL PARENT INFO -----
function autoFillParentInfo() {
    const parentName = localStorage.getItem("parentName") || "";
    const parentEmail = localStorage.getItem("parentEmail") || "";
    const parentPhone = localStorage.getItem("parentPhone") || "";

    document.getElementById("parentName").value = parentName;
    document.getElementById("parentEmail").value = parentEmail;
    document.getElementById("parentPhone").value = parentPhone;
}

// ----- BUILD REVIEW STEP -----
function buildReview() {
    const reviewBox = document.getElementById("reviewBox");

    const parentName = document.getElementById("parentName").value;
    const parentEmail = document.getElementById("parentEmail").value;
    const parentPhone = document.getElementById("parentPhone").value;

    const playerName = document.getElementById("playerName").value;
    const birthdate = document.getElementById("birthdate").value;
    const school = document.getElementById("school").value;
    const grade = document.getElementById("grade").value;
    const gender = document.getElementById("gender").value;
    const league = document.getElementById("league").value;
    const shirtSize = document.getElementById("shirtSize").value;

    const doctorName = document.getElementById("doctorName").value;
    const doctorPhone = document.getElementById("doctorPhone").value;
    const allergies = document.getElementById("allergies").value;

    const paymentPlan = document.getElementById("paymentPlan").value;

    let paymentText = "";
    if (paymentPlan === "full") {
        paymentText = "Pay in Full (Sibling discount applies if eligible).";
    } else {
        paymentText = `Pay in 2 Payments. Payment 1 now, Payment 2 due ${PAYMENT2_DUE_DISPLAY}. No sibling discount on split payments.`;
    }

    reviewBox.innerHTML = `
        <h4>Parent</h4>
        <p><strong>Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Phone:</strong> ${parentPhone}</p>

        <h4>Player</h4>
        <p><strong>Name:</strong> ${playerName}</p>
        <p><strong>Birthdate:</strong> ${birthdate}</p>
        <p><strong>School:</strong> ${school}</p>
        <p><strong>Grade:</strong> ${grade}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>League:</strong> ${league}</p>
        <p><strong>Shirt Size:</strong> ${shirtSize}</p>

        <h4>Medical</h4>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Doctor Phone:</strong> ${doctorPhone}</p>
        <p><strong>Allergies / Notes:</strong> ${allergies}</p>

        <h4>Payment</h4>
        <p>${paymentText}</p>
    `;
}

// ----- SUBMIT & PAY -----
function submitRegistration() {
    const parentName = document.getElementById("parentName").value;
    const parentEmail = document.getElementById("parentEmail").value;
    const parentPhone = document.getElementById("parentPhone").value;

    const playerName = document.getElementById("playerName").value;
    const birthdate = document.getElementById("birthdate").value;
    const school = document.getElementById("school").value;
    const grade = document.getElementById("grade").value;
    const gender = document.getElementById("gender").value;
    const league = document.getElementById("league").value;
    const shirtSize = document.getElementById("shirtSize").value;

    const doctorName = document.getElementById("doctorName").value;
    const doctorPhone = document.getElementById("doctorPhone").value;
    const allergies = document.getElementById("allergies").value;

    const paymentPlan = document.getElementById("paymentPlan").value;

    // Build payload for Google Sheets
    const payload = {
        action: "saveRegistration",
        parentName,
        parentEmail,
        parentPhone,
        playerName,
        birthdate,
        school,
        grade,
        gender,
        league,
        shirtSize,
        doctorName,
        doctorPhone,
        allergies,
        paymentPlan,
        payment2Due: PAYMENT2_DUE_DISPLAY
    };

    // TODO: replace with your actual Apps Script endpoint
    const SHEETS_ENDPOINT = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

    fetch(SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).catch(err => {
        console.error("Error saving registration:", err);
    });

    // Decide Square link
    const leagueKey = league === "Flag" ? "Flag" : "Jr Pro";
    let redirectUrl = "";

    if (paymentPlan === "full") {
        redirectUrl = SQUARE_LINKS[leagueKey].full;
    } else {
        redirectUrl = SQUARE_LINKS[leagueKey].split1;
        // Payment 2 link & due date will be shown in parent dashboard:
        // "Pay Remaining Balance (Due August 7)" using split2.
    }

    window.location.href = redirectUrl;
}
