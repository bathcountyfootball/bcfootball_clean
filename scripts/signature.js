// Your Apps Script endpoint
const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzQrgAYG45pcW1jg1HVuN8pwxjQwk3wa3CQPYGN8YwwdHH4T6qZb_CyR3_JDOaGiXG6/exec";

document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill date
  const d = new Date();
  const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  document.getElementById("signatureDate").value = dateStr;

  // Auto-fill parent name if stored
  const storedParentName = localStorage.getItem("parentName") || "";
  if (storedParentName) {
    document.getElementById("parentSignature").value = storedParentName;
  }
});

function submitSignature() {
  const parentSignature = document.getElementById("parentSignature").value.trim();
  const signatureDate = document.getElementById("signatureDate").value;
  const agreed = document.getElementById("agreeCheckbox").checked;

  if (!parentSignature || !agreed) {
    alert("Please enter your name and check the agreement box before signing.");
    return;
  }

  // Pull multi-player registration data from localStorage
  const parentName = localStorage.getItem("parentName") || "";
  const parentEmail = localStorage.getItem("parentEmail") || "";
  const parentPhone = localStorage.getItem("parentPhone") || "";
  const paymentPlan = localStorage.getItem("paymentPlan") || "";

  let players = [];
  try {
    players = JSON.parse(localStorage.getItem("players")) || [];
  } catch (e) {
    players = [];
  }

  const payload = {
    action: "saveSignature",
    parentName,
    parentEmail,
    parentPhone,
    parentSignature,
    signatureDate,
    agreed: agreed ? "YES" : "NO",
    paymentPlan,
    players
  };

  fetch(SHEETS_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // Redirect after signing
  window.location.href = "registration.html";
}
