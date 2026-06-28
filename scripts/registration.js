/****************************************************
 * BC FOOTBALL – MULTI‑PLAYER REGISTRATION SYSTEM
 * Full Player Details + Sibling Discounts
 ****************************************************/

const FLAG_PRICE = 57.00;
const JRPRO_PRICE = 77.50;
const GENERIC_PAY_LINK = "https://square.link/u/sS8n48d5?src=sheet";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6JerZUDpVjDLvhkZaJhl8bWXNiFsOJAf1wxNNgj6FaJm_suJwnV1ozbmmdXWz-KIf/exec";

let players = [];
let batchId = Date.now().toString();

const playersContainer = document.getElementById("players-container");
const addPlayerBtn = document.getElementById("add-player-btn");
const form = document.getElementById("registration-form");

/****************************************************
 * CREATE PLAYER BLOCK (FULL DETAILS)
 ****************************************************/
function createPlayerBlock(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "player-block";
  wrapper.dataset.index = index;

  wrapper.innerHTML = `
    <h3>Player ${index + 1}</h3>

    <label>
      Player Name:
      <input type="text" class="player-name" required>
    </label>

    <label>
      Birthdate:
      <input type="date" class="player-birthdate" required>
    </label>

    <label>
      Age:
      <input type="number" class="player-age" min="4" max="18" required>
    </label>

    <label>
      Grade:
      <input type="text" class="player-grade" required>
    </label>

    <label>
      School:
      <input type="text" class="player-school" required>
    </label>

    <label>
      Gender:
      <select class="player-gender" required>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </label>

    <label>
      Shirt Size:
      <select class="player-shirt-size" required>
        <option value="">Select</option>
        <option value="YS">YS</option>
        <option value="YM">YM</option>
        <option value="YL">YL</option>
        <option value="AS">AS</option>
        <option value="AM">AM</option>
        <option value="AL">AL</option>
        <option value="AXL">AXL</option>
      </select>
    </label>

    <label>
      Doctor Name:
      <input type="text" class="player-doctor-name" required>
    </label>

    <label>
      Doctor Phone:
      <input type="tel" class="player-doctor-phone" required>
    </label>

    <label>
      Allergies / Medical Conditions:
      <input type="text" class="player-allergies" required>
    </label>

    <label>
      Jr Pro Physical On File:
      <select class="player-physical" required>
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </label>

    <label>
      League:
      <select class="player-league" required>
        <option value="">Select</option>
        <option value="Flag">Flag</option>
        <option value="Jr Pro">Jr Pro</option>
      </select>
    </label>

    <label>
      Payment Type:
      <select class="player-payment" required>
        <option value="">Select</option>
        <option value="Pay in Full">Pay in Full</option>
        <option value="Pay in 2">Pay in 2</option>
      </select>
    </label>
  `;

  playersContainer.appendChild(wrapper);
}

/****************************************************
 * ADD PLAYER BUTTON
 ****************************************************/
function addPlayerBlock() {
  const index = players.length;
  players.push({});
  createPlayerBlock(index);
}

addPlayerBtn.addEventListener("click", addPlayerBlock);

// Start with one player by default
addPlayerBlock();

/****************************************************
 * SIBLING DISCOUNT LOGIC
 ****************************************************/
function calculateDiscounts(existingCount, newPlayersCount) {
  const discounts = [];
  let totalBeforeBatch = existingCount;

  for (let i = 0; i < newPlayersCount; i++) {
    const childNumber = totalBeforeBatch + 1;

    let discount = 0;
    if (childNumber === 2) discount = 5;
    if (childNumber >= 3) discount = 10;

    discounts.push(discount);
    totalBeforeBatch++;
  }

  return discounts;
}

/****************************************************
 * GET EXISTING COUNT FROM GOOGLE SHEETS
 ****************************************************/
async function fetchExistingCount(parentEmail) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "getExistingCount",
      parentEmail
    })
  });

  const data = await res.json();
  return data.count || 0;
}

/****************************************************
 * SAVE BATCH TO GOOGLE SHEETS
 ****************************************************/
async function saveBatchToSheet(parentInfo, players, total) {
  await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "saveBatch",
      parentName: parentInfo.name,
      parentEmail: parentInfo.email,
      parentPhone: parentInfo.phone,
      parentAddress: parentInfo.address,
      players,
      batchId,
      total,
      payLink: GENERIC_PAY_LINK
    })
  });
}

/****************************************************
 * FORM SUBMIT HANDLER
 ****************************************************/
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const parentName = document.getElementById("parent-name").value.trim();
  const parentEmail = document.getElementById("parent-email").value.trim();
  const parentPhone = document.getElementById("parent-phone").value.trim();
  const parentAddress = document.getElementById("parent-address") 
    ? document.getElementById("parent-address").value.trim() 
    : "";

  const parentInfo = { 
    name: parentName, 
    email: parentEmail, 
    phone: parentPhone,
    address: parentAddress
  };

  const blocks = document.querySelectorAll(".player-block");
  const currentBatchPlayers = [];

  blocks.forEach(block => {
    const player = {
      name: block.querySelector(".player-name").value.trim(),
      birthdate: block.querySelector(".player-birthdate").value.trim(),
      age: block.querySelector(".player-age").value.trim(),
      grade: block.querySelector(".player-grade").value.trim(),
      school: block.querySelector(".player-school").value.trim(),
      gender: block.querySelector(".player-gender").value,
      shirtSize: block.querySelector(".player-shirt-size").value,
      doctorName: block.querySelector(".player-doctor-name").value.trim(),
      doctorPhone: block.querySelector(".player-doctor-phone").value.trim(),
      allergies: block.querySelector(".player-allergies").value.trim(),
      physicalOnFile: block.querySelector(".player-physical").value,
      league: block.querySelector(".player-league").value,
      paymentType: block.querySelector(".player-payment").value
    };

    currentBatchPlayers.push(player);
  });

  if (currentBatchPlayers.length === 0) {
    alert("Please add at least one player.");
    return;
  }

  // 1️⃣ Get existing count
  const existingCount = await fetchExistingCount(parentEmail);

  // 2️⃣ Calculate discounts for Pay‑in‑Full players only
  const fullPayPlayers = currentBatchPlayers.filter(p => p.paymentType === "Pay in Full");
  const discounts = calculateDiscounts(existingCount, fullPayPlayers.length);

  let discountIndex = 0;
  let total = 0;
  const breakdownLines = [];

  currentBatchPlayers.forEach((p) => {
    const basePrice = p.league === "Flag" ? FLAG_PRICE : JRPRO_PRICE;

    let discountApplied = 0;
    if (p.paymentType === "Pay in Full") {
      discountApplied = discounts[discountIndex] || 0;
      discountIndex++;
    }

    const finalPrice = basePrice - discountApplied;
    total += finalPrice;

    breakdownLines.push(
      `${p.name} – ${p.league} – $${finalPrice.toFixed(2)}`
      + (discountApplied > 0 ? ` ($${discountApplied} sibling discount)` : "")
      + (p.paymentType === "Pay in 2" ? " (Pay in 2 – no discount)" : "")
    );

    p.basePrice = basePrice;
    p.discountApplied = discountApplied;
    p.finalPrice = finalPrice;
    p.batchId = batchId;
  });

  // 3️⃣ Show Review & Pay section
  const reviewSection = document.getElementById("review-section");
  const breakdownDiv = document.getElementById("breakdown");
  const totalDueP = document.getElementById("total-due");

  breakdownDiv.innerHTML = breakdownLines.map(l => `<p>${l}</p>`).join("");
  totalDueP.textContent = `Total Due: $${total.toFixed(2)}`;
  reviewSection.style.display = "block";

  // 4️⃣ Save batch to Google Sheets
  await saveBatchToSheet(parentInfo, currentBatchPlayers, total);

  alert("Registration saved. Please complete payment using the Pay Now button.");
});
