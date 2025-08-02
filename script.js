// script.js
const table = document.getElementById("routineTable").querySelector("tbody");
let schedule = [];

function addSchedule() {
  const subject = document.getElementById("subjectInput").value.trim();
  const day = document.getElementById("daySelect").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  if (!subject || !start || !end) {
    alert("Please fill all fields.");
    return;
  }

  const conflict = schedule.some(s => s.day === day && (
    (start >= s.start && start < s.end) ||
    (end > s.start && end <= s.end) ||
    (start <= s.start && end >= s.end)
  ));

  if (conflict) {
    alert("Schedule conflict detected!");
    return;
  }

  schedule.push({ subject, day, start, end });
  updateTable();
  clearFields();
}

function updateTable() {
  table.innerHTML = "";
  schedule.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${s.subject}</td><td>${s.day}</td><td>${s.start}</td><td>${s.end}</td>`;
    table.appendChild(row);
  });
}

function clearFields() {
  document.getElementById("subjectInput").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
}

function toggleMode() {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
}

function downloadRoutine() {
  html2canvas(document.querySelector(".container")).then(canvas => {
    const link = document.createElement("a");
    link.download = "routine.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.head.appendChild(script);
