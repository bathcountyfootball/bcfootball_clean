document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 1;

  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll("#progressBar .step");

  function showStep(step) {
    steps.forEach((s, i) => {
      s.style.display = i + 1 === step ? "block" : "none";
      progressSteps[i].classList.toggle("active", i + 1 === step);
    });
    currentStep = step;
  }

  showStep(1);

  // Navigation helpers
  const next = (n) => showStep(n);
  const prev = (n) => showStep(n);

  // Step 1
  document.getElementById("nextBtn").addEventListener("click", () => {
    const league = document.getElementById("leagueSelect").value;
    if (!league) return alert("Please select a league.");
    next(2);
  });

  // Step 2
  document.getElementById("prevBtn2").addEventListener("click", () => prev(1));
  document.getElementById("nextBtn2").addEventListener("click", () => {
    const name = document.getElementById("parentName").value.trim();
    const email = document.getElementById("parentEmail").value.trim();
    if (!name || !email) return alert("Please fill in all parent fields.");
    next(3);
  });

  // Step 3
  document.getElementById("prevBtn3").addEventListener("click", () => prev(2));
  document.getElementById("nextBtn3").addEventListener("click", () => {
    const playerName = document.getElementById("playerName").value.trim();
    const playerAge = document.getElementById("playerAge").value.trim();
    if (!playerName || !playerAge) return alert("Please fill in all player fields.");
    next(4);
  });

  // Step 4
  document.getElementById("prevBtn4").addEventListener("click", () => prev(3));
  document.getElementById("nextBtn4").addEventListener("click", () => {
    const medical = document.getElementById("medicalInfo").value.trim();
    if (!medical) return alert("Please fill in medical info.");
    next(5);
  });

  // Step 5
  document.getElementById("prevBtn5").addEventListener("click", () => prev(4));
  document.getElementById("nextBtn5").addEventListener("click", () => {
    const physical = document.getElementById("physicalInfo").value.trim();
    if (!physical) return alert("Please fill in physical info.");
    next(6);
  });

  // Step 6
  document.getElementById("prevBtn6").addEventListener("click", () => prev(5));
  document.getElementById("nextBtn6").addEventListener("click", () => {
    const signature = document.getElementById("signature").value.trim();
    if (!signature) return alert("Please type your full name as signature.");
    next(7);
  });

  // Step 7 (Payment)
  document.getElementById("prevBtn7").addEventListener("click", () => prev(6));
  document.getElementById("payBtn").addEventListener("click", async () => {
    const league = document.getElementById("leagueSelect").value;
    const paymentOption = document.getElementById("paymentOption").value;
    if (!paymentOption) return alert("Please select a payment option.");

    // Determine Square link
    let squareLink = "";
    if (league === "Flag") {
      squareLink =
        paymentOption === "PayFull"
          ? "https://square.link/u/1mXmf0Qd?src=sheet"
          : "https://square.link/u/Dp5uuZbF?src=sheet";
    } else if (league === "Junior") {
      squareLink =
        paymentOption === "PayFull"
          ? "https://square.link/u/erwjam6I?src=sheet"
          : "https://square.link/u/Vvt4QEPx?src=sheet";
    }

    // Save registration to Firebase
    try {
      const parentName = document.getElementById("parentName").value.trim();
      const parentEmail = document.getElementById("parentEmail").value.trim();
      const playerName = document.getElementById("playerName").value.trim();
      const playerAge = document.getElementById("playerAge").value.trim();
      const medicalInfo = document.getElementById("medicalInfo").value.trim();
      const physicalInfo = document.getElementById("physicalInfo").value.trim();
      const signature = document.getElementById("signature").value.trim();

      const collectionName =
        league === "Flag" ? "flag_registrations" : "jrpro_registrations";

      const registrationData = {
        parentName,
        parentEmail,
        playerName,
        playerAge,
        medicalInfo,
        physicalInfo,
        signature,
        league,
        paymentOption,
        paymentStatus: "Pending",
        timestamp: new Date().toISOString(),
      };

      // Assuming firebase.js initializes Firestore as db
      await db.collection(collectionName).add(registrationData);

      // Redirect to Square payment
      window.open(squareLink, "_blank");

      // Show confirmation
      document.getElementById("confirmDetails").innerHTML = `
        <strong>Parent:</strong> ${parentName}<br>
        <strong>Player:</strong> ${playerName}<br>
        <strong>League:</strong> ${league}<br>
        <strong>Payment Option:</strong> ${
          paymentOption === "PayFull" ? "Pay in Full" : "Pay in 2 Payments"
        }<br>
        <strong>Status:</strong> Pending Payment
      `;
      next(8);
    } catch (error) {
      console.error("Error saving registration:", error);
      alert("There was an error saving your registration. Please try again.");
    }
  });
});
