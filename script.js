// script.js
let fullText = "";
let sectionMap = {}; // section => text block

document.getElementById("fileInput").addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;

  if (file.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async function () {
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(reader.result),
      }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((s) => s.str).join(" ") + "\n";
      }

      fullText = normalizeText(text);
      prepareSections(fullText);
    };
    reader.readAsArrayBuffer(file);
  }

  else if (file.name.endsWith(".docx")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      mammoth.extractRawText({ arrayBuffer: e.target.result }).then((res) => {
        fullText = normalizeText(res.value);
        prepareSections(fullText);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  else {
    alert("Unsupported file format!");
  }
});

/* ---------- Helpers ---------- */

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

/* ---------- Section Detection ---------- */

function prepareSections(text) {
  sectionMap = {};

  const sectionRegex =
/(CSE[\s-_]*31[\s-_]*(?:D[\s-_]*)?(?:B[\s-_]*1?|B1)(?:\s*\(\d+\))?)/gi;
  const matches = [...text.matchAll(sectionRegex)];

  if (!matches.length) return;

  for (let i = 0; i < matches.length; i++) {
    const section = matches[i][1].toUpperCase();
    const start = matches[i].index;
    const end = matches[i + 1]?.index || text.length;

    sectionMap[section] = text.slice(start, end).trim();
  }

  populateSelector(Object.keys(sectionMap));
}

/* ---------- Populate Selector ---------- */

function populateSelector(sections) {
  const selector = document.getElementById("sectionSelector");
  selector.innerHTML = "";

  sections.sort().forEach((sec) => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    selector.appendChild(opt);
  });
}

/* ---------- Extract Multiple Sections ---------- */

function extractRoutine() {
  const selector = document.getElementById("sectionSelector");
  const selected = [...selector.selectedOptions].map(o => o.value);

  if (!selected.length) {
    alert("Please select at least one section!");
    return;
  }

  let output = "";

  selected.forEach((sec) => {
    output += `===== ${sec} =====\n`;
    output += sectionMap[sec] + "\n\n";
  });

  document.getElementById("routineDisplay").textContent = output.trim();
}

/* ---------- Download Image ---------- */

function downloadImage() {
  const display = document.getElementById("routineDisplay");
  html2canvas(display).then((canvas) => {
    const a = document.createElement("a");
    a.download = "routine.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
}

/* ---------- Theme Toggle ---------- */

function toggleMode() {
  document.body.classList.toggle("light");
}
