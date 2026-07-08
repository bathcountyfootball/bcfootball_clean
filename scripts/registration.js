const API_URL = 'https://script.google.com/macros/s/AKfycbwJR0mM--IOixP7NLMKN4owPphBM9FOtzryRJ3KbfkH0Nci8ylR2Gcg_Kg52XrwWWJQ/exec';

const PAY_FULL_LINK = 'https://square.link/u/sS8n48d5?src=sheet';
const PAY_PLAN_LINK = 'https://square.link/u/sS8n48d5?src=sheet';

const LEAGUE_FEES = {
  'Flag': 57,
  'Jr Pro': 77.50
};

const playersContainer = document.getElementById('playersContainer');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const reviewBtn = document.getElementById('reviewBtn');
const submitBtn = document.getElementById('submitBtn');

let playerCount = 0;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('parentName').value = localStorage.getItem('parentName') || '';
  document.getElementById('parentEmail').value = localStorage.getItem('parentEmail') || '';
  document.getElementById('parentPhone').value = localStorage.getItem('parentPhone') || '';

  addPlayer();
});

addPlayerBtn.onclick = addPlayer;
reviewBtn.onclick = renderReview;
submitBtn.onclick = submitRegistration;

function money(amount) {
  return Number(amount || 0).toFixed(2);
}

function addPlayer() {
  playerCount++;

  const div = document.createElement('div');
  div.className = 'player-card';

  div.innerHTML = `
    <h3>Player ${playerCount}</h3>

    <label>First Name</label>
    <input class="firstName" required>

    <label>Last Name</label>
    <input class="lastName" required>

    <label>Birthdate</label>
    <input class="birthdate" placeholder="MM/DD/YYYY">

    <label>Grade</label>
    <input class="grade" required>

    <label>School</label>
    <input class="school">

    <label>League</label>
    <select class="league">
      <option value="Flag">Flag</option>
      <option value="Jr Pro">Jr Pro</option>
    </select>

    <label>Shirt Size</label>
    <input class="shirtSize">

    <label>Medical Conditions</label>
    <input class="medical" placeholder="None">

    <label>Allergies</label>
    <input class="allergies" placeholder="None">

    <label>Emergency Contact Name</label>
    <input class="emergencyName">

    <label>Emergency Contact Phone</label>
    <input class="emergencyPhone">

    <button type="button" class="btn removeBtn">Remove Player</button>
  `;

  div.querySelector('.removeBtn').onclick = () => {
    div.remove();
    renderReview();
  };

  playersContainer.appendChild(div);
}

function getPlayers() {
  return [...document.querySelectorAll('.player-card')]
    .map(card => {
      const g = cls => {
        const el = card.querySelector('.' + cls);
        return el ? el.value.trim() : '';
      };

      const firstName = g('firstName');
      const lastName = g('lastName');

      return {
        firstName: firstName,
        lastName: lastName,
        playerName: `${firstName} ${lastName}`.trim(),
        birthdate: g('birthdate'),
        grade: g('grade'),
        school: g('school'),
        league: g('league'),
        team: '',
        shirtSize: g('shirtSize'),
        medical: g('medical'),
        allergies: g('allergies'),
        emergencyName: g('emergencyName'),
        emergencyPhone: g('emergencyPhone')
      };
    })
    .filter(p => p.firstName || p.lastName);
}

function pricedPlayers() {
  return getPlayers().map((p, i) => {
    const baseFee = LEAGUE_FEES[p.league] || 0;
    const discount = i === 0 ? 0 : (i === 1 ? 10 : 5);
    const finalFee = Math.max(baseFee - discount, 0);

    return {
      ...p,
      baseFee,
      discount,
      finalFee
    };
  });
}

function renderReview() {
  const players = pricedPlayers();
  const total = players.reduce((s, p) => s + Number(p.finalFee || 0), 0);
  const paymentPlan = document.getElementById('paymentPlan').value;

  let paymentText = '';

  if (paymentPlan === 'plan') {
    const firstPayment = Math.round((total / 2) * 100) / 100;
    const remaining = Math.round((total - firstPayment) * 100) / 100;

    paymentText = `
      <hr>
      <p><b>Two Payment Plan</b></p>
      <p>Amount Due Now: <b>$${money(firstPayment)}</b></p>
      <p>Remaining Balance: <b>$${money(remaining)}</b></p>
    `;
  } else if (paymentPlan === 'full') {
    paymentText = `
      <hr>
      <p><b>Pay In Full</b></p>
      <p>Amount Due Now: <b>$${money(total)}</b></p>
    `;
  }

  reviewBox.innerHTML = players.length
    ? players.map((p, i) => `
        <p>
          <b>${p.playerName || 'Player ' + (i + 1)}</b>
          (${p.league}):
          $${money(p.baseFee)} - $${money(p.discount)}
          = <b>$${money(p.finalFee)}</b>
        </p>
      `).join('') +
      `<hr><h3>Family Total: $${money(total)}</h3>` +
      paymentText
    : 'Add at least one player.';

  return {
    players,
    total
  };
}

async function submitRegistration() {
  const parentName = document.getElementById('parentName');
  const parentEmail = document.getElementById('parentEmail');
  const parentPhone = document.getElementById('parentPhone');
  const parentAddress = document.getElementById('parentAddress');
  const paymentPlan = document.getElementById('paymentPlan');

  const { players, total } = renderReview();

  if (
    !parentName.value.trim() ||
    !parentEmail.value.trim() ||
    !parentPhone.value.trim() ||
    !parentAddress.value.trim() ||
    !paymentPlan.value ||
    players.length === 0
  ) {
    alert('Please complete parent info, payment option, and at least one player.');
    return;
  }

  let amountDueNow = total;
  let remainingBalance = 0;

  if (paymentPlan.value === 'plan') {
    amountDueNow = Math.round((total / 2) * 100) / 100;
    remainingBalance = Math.round((total - amountDueNow) * 100) / 100;
  }

  const payload = {
    action: 'registerFamily',
    parentName: parentName.value.trim(),
    parentEmail: parentEmail.value.trim().toLowerCase(),
    parentPhone: parentPhone.value.trim(),
    parentAddress: parentAddress.value.trim(),
    paymentPlan: paymentPlan.value,
    leagueFees: LEAGUE_FEES,
    familyTotal: total,
    amountDueNow: amountDueNow,
    remainingBalance: remainingBalance,
    paymentLink: paymentPlan.value === 'plan' ? PAY_PLAN_LINK : PAY_FULL_LINK,
    players: players
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving Registration...';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || 'Registration failed');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Registration & Pay';
      return;
    }

    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('familyTotal', money(total));
    localStorage.setItem('amountDueNow', money(amountDueNow));
    localStorage.setItem('remainingBalance', money(remainingBalance));

    alert(
      `Registration saved.\n\nAmount to enter in Square: $${money(amountDueNow)}`
    );

    window.location.href = paymentPlan.value === 'plan' ? PAY_PLAN_LINK : PAY_FULL_LINK;

  } catch (err) {
    alert('Registration failed: ' + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Registration & Pay';
  }
}