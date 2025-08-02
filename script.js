let isDark = false;

function toggleDarkMode() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
}

function addSchedule() {
  const section = document.getElementById("section").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const day = document.getElementById("day").value.trim();
  const time = document.getElementById("time").value.trim();

  if (!section || !subject || !day || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const tbody = document.querySelector("#schedule-table tbody");
  const rows = tbody.querySelectorAll("tr");

  for (let row of rows) {
    const rowDay = row.cells[2].innerText;
    const rowTime = row.cells[3].innerText;
    if (day === rowDay && time === rowTime) {
      alert("⚠️ Conflict: Another subject is already scheduled at this time.");
      return;
    }
  }

  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${section}</td><td>${subject}</td><td>${day}</td><td>${time}</td>`;
  tbody.appendChild(tr);

  document.getElementById("section").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("day").value = "";
  document.getElementById("time").value = "";
}

function downloadAsImage() {
  html2canvas(document.querySelector(".container")).then(canvas => {
    const link = document.createElement('a');
    link.download = 'routine.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Add html2canvas library
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(script);
