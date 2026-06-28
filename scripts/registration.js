// scripts/registration.js
// Basic multi-step registration flow

let currentStep = 1;
const totalSteps = 7;

function showStep(step) {
  document.querySelectorAll(".form-step").forEach((el, i) => {
    el.style.display = i + 1 === step ? "block" : "none";
  });
  currentStep = step;
  localStorage.setItem("currentStep", step);
}

function nextStep() {
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  } else {
    startPayment();
  }
}

function startPayment() {
  // Stripe redirect logic
  console.log("Redirecting to Stripe checkout...");
  window.location.href = "https://checkout.stripe.com/pay"; // replace with your Stripe link
}

// Initialize form on load
document.addEventListener("DOMContentLoaded", () => {
  const savedStep = parseInt(localStorage.getItem("currentStep")) || 1;
  showStep(savedStep);
  document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", nextStep);
  });
});
