// script.js
let fullText = "";

document.getElementById("fileInput").addEventListener("change", async function () {
  const file = this.files[0];
  if (!file) return;

  if (file.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async function () {
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((s) => s.str).join(" ") + "\n";
      }
      fullText = text;
      populateSections(text);
    };
    reader.readAsArrayBuffer(file);
  } else if (file.name.endsWith(".docx")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      mammoth.extractRawText({ arrayBuffer: e.target.result }).then((res) => {
        fullText = res.value;
        populateSections(res.value);
      });
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Unsupported file format!");
  }
});

function populateSections(text) {
  const matches = [...text.matchAll(/CSE[-_ ]?\d{2,3}[ -]*[A-D]/gi)];
  const uniqueSections = [...new Set(matches.map((m) => m[0].toUpperCase()))];
  const selector = document.getElementById("sectionSelector");
  selector.innerHTML = "<option>Select Section</option>";
  uniqueSections.forEach((sec) => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    selector.appendChild(opt);
  });
}

function extractRoutine() {
  const section = document.getElementById("sectionSelector").value;
  if (!section || section === "Select Section") return alert("Please choose a section!");
  const regex = new RegExp(`${section}[^]*?(?=CSE-|$)`, "gi");
  const match = fullText.match(regex);
  document.getElementById("routineDisplay").textContent = match ? match.join("\n\n") : "No routine found.";
}

function downloadImage() {
  const display = document.getElementById("routineDisplay");
  html2canvas(display).then((canvas) => {
    const a = document.createElement("a");
    a.download = "routine.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
}

function toggleMode() {
  document.body.classList.toggle("light");
}
