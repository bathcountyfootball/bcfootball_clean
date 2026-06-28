/*
Student Name: Kristie Jones 
File Name: load-tables.js
*/
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTwjHB-VRIU3mK2rq2B4jsyVq8wnxwq0w5Da4GhtddHbnJaHRTy_-0ztdY3f9lJC0GAYKlzFt_jZNL5/pub?output=csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1); // Skip header
    const table = document.getElementById('schedule-body');
    rows.forEach(row => {
      const [week, date, opponent, location] = row.split(',');
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${week}</td><td>${date}</td><td>${opponent}</td><td>${location}</td>`;
      table.appendChild(tr);
    });
  });
