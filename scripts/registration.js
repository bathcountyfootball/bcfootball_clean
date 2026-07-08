const API_URL = 'https://script.google.com/macros/s/AKfycbzQrgAYG45pcW1jg1HVuN8pwxjQwk3wa3CQPYGN8YwwdHH4T6qZb_CyR3_JDOaGiXG6/exec';
const PAY_FULL_LINK = 'https://square.link/u/sS8n48d5?src=sheet';
const PAY_PLAN_LINK = 'https://square.link/u/sS8n48d5?src=sheet';

// Change these two amounts to your actual league fees.
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
  parentName.value = localStorage.getItem('parentName') || '';
  parentEmail.value = localStorage.getItem('parentEmail') || '';
  parentPhone.value = localStorage.getItem('parentPhone') || '';
  addPlayer();
});

addPlayerBtn.onclick = addPlayer;
reviewBtn.onclick = renderReview;
submitBtn.onclick = submitRegistration;

function addPlayer() {
  playerCount++;
  const div = document.createElement('div');
  div.className = 'player-card';
  div.innerHTML = `
    <h3>Player ${playerCount}</h3>
    <label>First Name</label><input class="firstName" required>
    <label>Last Name</label><input class="lastName" required>
    <label>Birthdate</label><input class="birthdate" placeholder="MM/DD/YYYY">
    <label>Grade</label><input class="grade" required>
    <label>School</label><input class="school">
    <label>League</label><select class="league"><option>Flag</option><option>Jr Pro</option></select>
    <label>Team</label><select class="team"><option>Unassigned</option><option>Flag</option><option>Jr Pro</option></select>
    <label>Shirt Size</label><input class="shirtSize">
    <label>Medical Conditions</label><input class="medical" placeholder="None">
    <label>Allergies</label><input class="allergies" placeholder="None">
    <label>Emergency Contact Name</label><input class="emergencyName">
    <label>Emergency Contact Phone</label><input class="emergencyPhone">
    <button type="button" class="btn removeBtn">Remove Player</button>`;
  div.querySelector('.removeBtn').onclick = () => { div.remove(); renderReview(); };
  playersContainer.appendChild(div);
}

function getPlayers() {
  return [...document.querySelectorAll('.player-card')].map(card => {
    const g = cls => card.querySelector('.' + cls).value.trim();
    return { firstName:g('firstName'), lastName:g('lastName'), playerName:(g('firstName')+' '+g('lastName')).trim(), birthdate:g('birthdate'), grade:g('grade'), school:g('school'), league:g('league'), team:g('team'), shirtSize:g('shirtSize'), medical:g('medical'), allergies:g('allergies'), emergencyName:g('emergencyName'), emergencyPhone:g('emergencyPhone') };
  }).filter(p => p.firstName || p.lastName);
}
function pricedPlayers(){
  return getPlayers().map((p,i)=>{
    const baseFee = LEAGUE_FEES[p.league] || 0;
    const discount = i === 0 ? 0 : (i === 1 ? 10 : 5);
    return {...p, baseFee, discount, finalFee: Math.max(baseFee - discount, 0)};
  });
}
function renderReview(){
  const players = pricedPlayers();
  const total = players.reduce((s,p)=>s+p.finalFee,0);
  reviewBox.innerHTML = players.length ? players.map((p,i)=>`<p><b>${p.playerName || 'Player '+(i+1)}</b> (${p.league}): $${p.baseFee} - $${p.discount} = <b>$${p.finalFee}</b></p>`).join('') + `<hr><h3>Total: $${total.toFixed(2)}</h3>` : 'Add at least one player.';
  return {players,total};
}
async function submitRegistration(){
  const {players,total} = renderReview();
  if(!parentName.value || !parentEmail.value || !parentPhone.value || !parentAddress.value || !paymentPlan.value || players.length===0){ alert('Please complete parent info, payment option, and at least one player.'); return; }
  const payload = { action:'registerFamily', parentName:parentName.value.trim(), parentEmail:parentEmail.value.trim().toLowerCase(), parentPhone:parentPhone.value.trim(), parentAddress:parentAddress.value.trim(), paymentPlan:paymentPlan.value, leagueFees:LEAGUE_FEES, totalDue:total, players };
  const res = await fetch(API_URL,{method:'POST',body:JSON.stringify(payload)});
  const data = await res.json();
  if(!data.success){ alert(data.message || 'Registration failed'); return; }
  localStorage.setItem('players', JSON.stringify(players)); localStorage.setItem('familyTotal', total.toFixed(2));
  window.location.href = paymentPlan.value === 'plan' ? PAY_PLAN_LINK : PAY_FULL_LINK;
}
