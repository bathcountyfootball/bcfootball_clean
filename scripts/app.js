// GLOBAL REGISTRATION DATA
const registrationData = {
    league: null,
    registrationType: "Season",
    price: 0,
    discount: 0,
    total: 0,
    parent: {},
    player: {},
    medical: {},
    physicalStatus: null,
    signature: null
};

// PROGRESS BAR
function setProgress(stepIndex) {
    const steps = document.querySelectorAll("#progressBar .progress-step");
    steps.forEach((s, i) => {
        s.classList.toggle("active", i <= stepIndex);
    });
}

// SHOW/HIDE STEPS
function showStep(stepId, index) {
    const allSteps = [
        "stepLeague",
        "stepParent",
        "stepPlayer",
        "stepMedical",
        "stepPhysical",
        "stepSignature",
        "stepPayment",
        "stepConfirm"
    ];
    allSteps.forEach(id => {
        document.getElementById(id).style.display = (id === stepId) ? "block" : "none";
    });
    setProgress(index);
}

// STEP 0 — LEAGUE SELECTION
function selectLeague(league) {
    registrationData.league = league;
    showStep("stepParent", 1);
}

function goBackToLeague() {
    showStep("stepLeague", 0);
}

// STEP 1 — PARENT INFO
function goToPlayer() {
    registrationData.parent = {
        name: document.getElementById("parentName").value,
        email: document.getElementById("parentEmail").value,
        phone: document.getElementById("parentPhone").value,
        address: document.getElementById("parentAddress").value
    };
    showStep("stepPlayer", 2);
}

function goToParent() {
    showStep("stepParent", 1);
}

// STEP 2 — PLAYER INFO
function goToMedical() {
    registrationData.player = {
        name: document.getElementById("playerName").value,
        grade: document.getElementById("playerGrade").value,
        dob: document.getElementById("playerDob").value,
        jersey: document.getElementById("playerJersey").value
    };
    showStep("stepMedical", 3);
}

function goToPlayer() {
    showStep("stepPlayer", 2);
}

// STEP 3 — MEDICAL INFO
function goToPhysical() {
    registrationData.medical = {
        conditions: document.getElementById("medicalConditions").value,
        emergencyName: document.getElementById("emergencyContact").value,
        emergencyPhone: document.getElementById("emergencyPhone").value
    };

    if (registrationData.league === "JrPro") {
        showStep("stepPhysical", 4);
    } else {
        showStep("stepSignature", 5);
    }
}

function goToMedical() {
    showStep("stepMedical", 3);
}

// STEP 4 — PHYSICAL (JR PRO ONLY)
function goToSignature() {
    const status = document.getElementById("physicalStatus").value;
    registrationData.physicalStatus = status;

    if (status === "no") {
        document.getElementById("physicalWarning").style.display = "block";
    } else {
        document.getElementById("physicalWarning").style.display = "none";
    }

    showStep("stepSignature", 5);
}

function goBackFromSignature() {
    if (registrationData.league === "JrPro") {
        showStep("stepPhysical", 4);
    } else {
        showStep("stepMedical", 3);
    }
}

// STEP 5 — SIGNATURE
function goToPayment() {
    registrationData.signature = document.getElementById("signatureName").value;

    // Auto-select Season pricing
    const basePrice = (registrationData.league === "JrPro") ? 75 : 55;
    registrationData.price = basePrice;

    // Placeholder sibling discount
    const discount = calculateSiblingDiscount();
    registrationData.discount = discount;
    registrationData.total = basePrice - discount;

    // Update UI
    document.getElementById("summaryLeague").textContent =
        registrationData.league === "JrPro" ? "Jr Pro" : "Flag";
    document.getElementById("summaryPrice").textContent = `$${basePrice}`;

    if (discount > 0) {
        document.getElementById("discountRow").style.display = "flex";
        document.getElementById("summaryDiscount").textContent = `-$${discount}`;
    } else {
        document.getElementById("discountRow").style.display = "none";
    }

    document.getElementById("summaryTotal").textContent = `$${registrationData.total}`;

    showStep("stepPayment", 6);
}

function goBackFromPayment() {
    showStep("stepSignature", 5);
}

// SIBLING DISCOUNT PLACEHOLDER
function calculateSiblingDiscount() {
    return 0; // Replace with real logic later
}

// STEP 6 — SUBMIT REGISTRATION
function submitRegistration() {
    console.log("Registration submitted:", registrationData);

    document.getElementById("confirmLeague").textContent =
        registrationData.league === "JrPro" ? "Jr Pro Season" : "Flag Season";
    document.getElementById("confirmPlayer").textContent = registrationData.player.name;
    document.getElementById("confirmParent").textContent = registrationData.parent.name;
    document.getElementById("confirmTotal").textContent = `$${registrationData.total}`;

    showStep("stepConfirm", 7);
}
