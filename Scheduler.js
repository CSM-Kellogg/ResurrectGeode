/**
 * By ChatGPT
 * 
 */

const resultsList = document.getElementById('resultsList');
const searchInput = document.getElementById('searchInput');
const searchHelper = document.getElementById('searchHelper');
const noResultsMessage = document.getElementById('noResultsMessage');

const mockClasses = [
    { id: 1, name: "Math 101", day: "Mon", hour: 9 },
    { id: 2, name: "History 201", day: "Tue", hour: 10 },
    { id: 3, name: "CS 301", day: "Wed", hour: 11 },
];

let debounceTimeout;

searchInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    const query = this.value.trim().toLowerCase();

    resultsList.innerHTML = '';
    noResultsMessage.style.display = 'none'; // hide by default

    if (query.length < 3) {
      searchHelper.style.display = 'block';
      return;
    }

    searchHelper.style.display = 'none';

    const filtered = mockClasses
      .filter(c => c.name.toLowerCase().includes(query))
      .slice(0, 10);

    if (filtered.length === 0) {
      noResultsMessage.style.display = 'block';
      return;
    }

    filtered.forEach(cls => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = cls.name;

      const addButton = document.createElement('button');
      addButton.className = 'btn btn-sm btn-success';
      addButton.textContent = 'Add';
      addButton.onclick = () => addToSchedule(cls);

      li.appendChild(addButton);
      resultsList.appendChild(li);
    });
  }, 300);
});

function addToSchedule(cls) {
    const cell = document.querySelector(`[data-day="${cls.day}"][data-hour="${cls.hour}"]`);
    if (cell && cell.innerHTML === '') {
    const block = document.createElement('div');
    block.className = 'class-block';
    block.textContent = cls.name;
    cell.appendChild(block);
    }
}

/** 
 * render the scheduler
 * By ChatGPT
 * 
*/
function renderScheduleGrid() {
  const schedule = document.getElementById("schedule");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  // Add top header row
  schedule.innerHTML += `<div class="schedule-cell"></div>`; // Empty top-left corner
  for (const day of days) {
    schedule.innerHTML += `<div class="schedule-cell">${day}</div>`;
  }

  // Add time rows
  for (let i = 0; i < 10; i++) {
    const hour = 8 + i;
    schedule.innerHTML += `<div class="schedule-cell schedule-time">${hour}:00</div>`;
    for (const day of days) {
      schedule.innerHTML += `<div class="schedule-cell" data-day="${day}" data-hour="${hour}"></div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderScheduleGrid();
});