// registration.js
// Multi-step flow + data collection + handoff to Stripe/Firebase

let currentStep = 1;
const totalSteps = 8;

const form = document.getElementById("registrationForm");
const steps = Array.from(document.querySelectorAll(".bc-step"));
const progressSteps = Array.from(document.querySelectorAll(".bc-progress-step"));
const paymentSummary = document.getElementById("paymentSummary");
const confirmationTotal = document.getElementById("confirmationTotal");
const startPaymentBtn = document.getElementById("startPayment");

function showStep(step) {
  currentStep = step;

  steps.forEach(s => {
    s.classList.toggle("active", Number(s.dataset.step) === step);
  });

  progressSteps.forEach(p => {
    p.classList.toggle("active", Number(p.dataset.step) === step);
  });
}

function nextStep() {
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

function getFormData() {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

// Simple fee logic (you can refine amounts)
function calculateFees(data) {
  let base = 75; // default
  if (data.league === "Flag") base = 50;
  if (data.league === "Middle School") base = 100;
  if (data.league === "High School") base = 125;

  // Placeholder sibling discount logic (extend later)
  const siblingDiscount = 0;

  const total = base - siblingDiscount;

  return { base, siblingDiscount, total };
}

function updatePaymentSummary() {
  const data = getFormData();
  const fees = calculateFees(data);

  paymentSummary.innerHTML = `
    <p><strong>League:</strong> ${data.league || "N/A"}</p>
    <p><strong>Base Fee:</strong> $${fees.base}</p>
    <p><strong>Sibling Discount:</strong> $${fees.siblingDiscount}</p>
    <p><strong>Total:</strong> $${fees.total}</p>
  `;
}

function handleStartPayment() {
  const data = getFormData();
  const fees = calculateFees(data);

  // Hand off to Stripe (stripe.js should expose startCheckout)
  if (typeof startCheckout === "function") {
    startCheckout({
      ...data,
      amount: fees.total
    });
  } else {
    console.warn("Stripe startCheckout() not found; redirect placeholder.");
    // Fallback: simple redirect (replace with your real Stripe link)
    window.location.href = "https://checkout.stripe.com/pay";
  }

  // Move to confirm step
  showStep(8);
  confirmationTotal.textContent = `Total Paid: $${fees.total}`;
}

// Attach events
document.addEventListener("DOMContentLoaded", () => {
  showStep(1);

  document.querySelectorAll(".bc-next").forEach(btn => {
    btn.addEventListener("click", () => {
      if (form.reportValidity()) {
        if (currentStep === 7) {
          updatePaymentSummary();
        }
        nextStep();
      }
    });
  });

  document.querySelectorAll(".bc-prev").forEach(btn => {
    btn.addEventListener("click", prevStep);
  });

  if (startPaymentBtn) {
    startPaymentBtn.addEventListener("click", () => {
      if (form.reportValidity()) {
        updatePaymentSummary();
        handleStartPayment();
      }
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const data = getFormData();

    // Save to Firebase (firebase.js should expose saveRegistration)
    if (typeof saveRegistration === "function") {
      saveRegistration(data);
    } else {
      console.warn("Firebase saveRegistration() not found; skipping save.");
    }

    alert("Registration complete. Thank you!");
    window.location.href = "index.html";
  });
});
