const FLAG_PRICE = 57.00;
const JRPRO_PRICE = 77.50;
const GENERIC_PAY_LINK = "https://square.link/u/sS8n48d5?src=sheet";

let players = [];
let batchId = Date.now().toString();

const playersContainer = document.getElementById('players-container');
const addPlayerBtn = document.getElementById('add-player-btn');
const form = document.getElementById('registration-form');

function createPlayerBlock(index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'player-block';
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

function addPlayerBlock() {
  const index = players.length;
  players.push({});
  createPlayerBlock(index);
}

addPlayerBtn.addEventListener('click', addPlayerBlock);

// start with one player by default
addPlayerBlock();

function calculateDiscounts(existingCount, newPlayers) {
  // existingCount: players already in sheet for this parent
  // newPlayers: number of players in this batch
  const discounts = [];
  let totalBeforeBatch = existingCount;

  for (let i = 0; i < newPlayers; i++) {
    const childNumber = totalBeforeBatch + 1; // 1-based
    let discount = 0;

    if (childNumber === 2) {
      discount = 5;
    } else if (childNumber >= 3) {
      discount = 10;
    }

    discounts.push(discount);
    totalBeforeBatch++;
  }

  return discounts;
}

async function fetchExistingCount(parentEmail) {
  const url = 'YOUR_APPS_SCRIPT_WEB_APP_URL'; // replace with deployed URL
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'getExistingCount',
      parentEmail
    })
  });
  const data = await res.json();
  return data.count || 0;
}

async function saveBatchToSheet(parentInfo, players, total) {
  const url = 'YOUR_APPS_SCRIPT_WEB_APP_URL'; // replace with deployed URL
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      action: 'saveBatch',
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const parentName = document.getElementById('parent-name').value.trim();
  const parentEmail = document.getElementById('parent-email').value.trim();
  const parentPhone = document.getElementById('parent-phone').value.trim();

  const parentInfo = { name: parentName, email: parentEmail, phone: parentPhone };

  const blocks = document.querySelectorAll('.player-block');
  const currentBatchPlayers = [];

  blocks.forEach(block => {
    const name = block.querySelector('.player-name').value.trim();
    const grade = block.querySelector('.player-grade').value.trim();
    const league = block.querySelector('.player-league').value;
    const paymentType = block.querySelector('.player-payment').value;

    currentBatchPlayers.push({
      name,
      grade,
      league,
      paymentType
    });
  });

  if (currentBatchPlayers.length === 0) {
    alert('Please add at least one player.');
    return;
  }

  // 1) get existing count for this parent
  const existingCount = await fetchExistingCount(parentEmail);

  // 2) calculate discounts for this batch (only for Pay in Full)
  const discounts = calculateDiscounts(
    existingCount,
    currentBatchPlayers.filter(p => p.paymentType === 'Pay in Full').length
  );

  let discountIndex = 0;
  let total = 0;
  const breakdownLines = [];

  currentBatchPlayers.forEach((p, idx) => {
    const basePrice = p.league === 'Flag' ? FLAG_PRICE : JRPRO_PRICE;
    let discountApplied = 0;

    if (p.paymentType === 'Pay in Full') {
      discountApplied = discounts[discountIndex] || 0;
      discountIndex++;
    }

    const finalPrice = basePrice - discountApplied;
    total += finalPrice;

    breakdownLines.push(
      `${p.name} – ${p.league} – $${finalPrice.toFixed(2)}`
      + (discountApplied > 0 ? ` ($${discountApplied} sibling discount)` : '')
      + (p.paymentType === 'Pay in 2' ? ' (Pay in 2 – no discount)' : '')
    );

    p.basePrice = basePrice;
    p.discountApplied = discountApplied;
    p.finalPrice = finalPrice;
    p.batchId = batchId;
  });

  // 3) show review & pay
  const reviewSection = document.getElementById('review-section');
  const breakdownDiv = document.getElementById('breakdown');
  const totalDueP = document.getElementById('total-due');

  breakdownDiv.innerHTML = breakdownLines.map(l => `<p>${l}</p>`).join('');
  totalDueP.textContent = `Total Due: $${total.toFixed(2)}`;
  reviewSection.style.display = 'block';

  // 4) save batch to sheet
  await saveBatchToSheet(parentInfo, currentBatchPlayers, total);

  alert('Registration saved. Please complete payment using the Pay Now button.');
});
