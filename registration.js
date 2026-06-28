/****************************************************
 * BC FOOTBALL – MULTI‑PLAYER REGISTRATION SYSTEM
 * Sibling Discounts + Mixed Leagues + One Checkout
 ****************************************************/

const FLAG_PRICE = 57.00;
const JRPRO_PRICE = 77.50;
const GENERIC_PAY_LINK = "https://square.link/u/sS8n48d5?src=sheet";

// ⭐ IMPORTANT — REPLACE THIS WITH YOUR REAL URL ⭐
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFonVe10t-NbnLSGOq885K405MkIJguS_7PnB6V95vXjUS32ite_xdLdZ3QdytNi6T/exec";

let players = [];
let batchId = Date.now().toString();

const playersContainer = document.getElementById("players-container");
const addPlayerBtn = document.getElementById("add-player-btn");
const form = document.getElementById("registration-form");

/****************************************************
 * CREATE PLAYER BLOCK
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
      Grade:
      <input type="text" class="player-grade" required>
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

  const parentInfo = { name: parentName, email: parentEmail, phone: parentPhone };

  const blocks = document.querySelectorAll(".player-block");
  const currentBatchPlayers = [];

  blocks.forEach(block => {
    const name = block.querySelector(".player-name").value.trim();
    const grade = block.querySelector(".player-grade").value.trim();
    const league = block.querySelector(".player-league").value;
    const paymentType = block.querySelector(".player-payment").value;

    currentBatchPlayers.push({
      name,
      grade,
      league,
      paymentType
    });
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
