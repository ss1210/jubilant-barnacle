const totalWeightInput = document.getElementById("total-weight");
const targetPercentInput = document.getElementById("target-percent");
const conversionPercentInput = document.getElementById("conversion-percent");
const quickButtons = document.querySelectorAll(".quick-buttons button");
const addRowButton = document.getElementById("add-row");
const addSaltRowButton = document.getElementById("add-salt-row");
const resetButton = document.getElementById("reset-form");
const seasoningBody = document.getElementById("seasoning-body");

const totalSaltOutput = document.getElementById("total-salt");
const currentPercentOutput = document.getElementById("current-percent");
const requiredSaltOutput = document.getElementById("required-salt");
const conversionAmountOutput = document.getElementById("conversion-amount");

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("ja-JP", {
    maximumFractionDigits: value >= 100 ? 1 : 2,
  });
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function updateCalculations() {
  let totalSalt = 0;

  const rows = Array.from(seasoningBody.querySelectorAll("tr"));

  rows.forEach((row) => {
    const amountInput = row.querySelector(".seasoning-amount");
    const percentInput = row.querySelector(".seasoning-percent");
    const saltOutput = row.querySelector(".seasoning-salt-amount");

    const amount = Math.max(parseNumber(amountInput.value), 0);
    const percent = Math.max(parseNumber(percentInput.value), 0);

    const saltAmount = amount * (percent / 100);
    saltOutput.textContent = formatNumber(saltAmount);

    totalSalt += saltAmount;
  });

  const totalWeight = Math.max(parseNumber(totalWeightInput.value), 0);
  const targetPercent = Math.max(parseNumber(targetPercentInput.value), 0);
  const currentPercent = totalWeight > 0 ? (totalSalt / totalWeight) * 100 : 0;
  const requiredSalt = Math.max((targetPercent / 100) * totalWeight - totalSalt, 0);

  totalSaltOutput.textContent = formatNumber(totalSalt);
  currentPercentOutput.textContent = totalWeight > 0 ? formatNumber(currentPercent) : "0";
  requiredSaltOutput.textContent = formatNumber(requiredSalt);

  const conversionPercent = Math.max(parseNumber(conversionPercentInput.value), 0);
  const conversionAmount = conversionPercent > 0 ? requiredSalt / (conversionPercent / 100) : 0;
  conversionAmountOutput.textContent = formatNumber(conversionAmount);
}

function attachRowEvents(row) {
  row.addEventListener("input", (event) => {
    if (event.target.classList.contains("seasoning-amount") || event.target.classList.contains("seasoning-percent")) {
      updateCalculations();
    }
  });

  row.addEventListener("dblclick", (event) => {
    if (event.target.tagName === "INPUT") {
      return;
    }

    row.remove();
    updateCalculations();
  });
}

function addSeasoningRow({ name = "", amount = "", percent = "" } = {}) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "seasoning-name";
  nameInput.placeholder = "例: しょうゆ";
  nameInput.value = name;
  nameCell.appendChild(nameInput);

  const amountCell = document.createElement("td");
  const amountInput = document.createElement("input");
  amountInput.type = "number";
  amountInput.min = "0";
  amountInput.step = "0.1";
  amountInput.inputMode = "decimal";
  amountInput.className = "seasoning-amount";
  amountInput.value = amount;
  amountCell.appendChild(amountInput);

  const percentCell = document.createElement("td");
  const percentInput = document.createElement("input");
  percentInput.type = "number";
  percentInput.min = "0";
  percentInput.max = "100";
  percentInput.step = "0.1";
  percentInput.inputMode = "decimal";
  percentInput.className = "seasoning-percent";
  percentInput.value = percent;
  percentCell.appendChild(percentInput);

  const saltCell = document.createElement("td");
  const saltOutput = document.createElement("output");
  saltOutput.className = "seasoning-salt-amount";
  saltOutput.textContent = "0";
  saltCell.appendChild(saltOutput);

  row.append(nameCell, amountCell, percentCell, saltCell);
  seasoningBody.appendChild(row);
  attachRowEvents(row);
  updateCalculations();
}

function resetForm() {
  totalWeightInput.value = "";
  targetPercentInput.value = "";
  conversionPercentInput.value = "14";

  while (seasoningBody.firstChild) {
    seasoningBody.removeChild(seasoningBody.firstChild);
  }

  addSeasoningRow();
  updateCalculations();
}

function initialize() {
  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      targetPercentInput.value = button.dataset.percent;
      updateCalculations();
    });
  });

  [totalWeightInput, targetPercentInput, conversionPercentInput].forEach((input) => {
    input.addEventListener("input", updateCalculations);
  });

  addRowButton.addEventListener("click", () => {
    addSeasoningRow();
  });

  addSaltRowButton.addEventListener("click", () => {
    addSeasoningRow({ name: "食塩", percent: "100" });
  });

  resetButton.addEventListener("click", () => {
    resetForm();
  });

  addSeasoningRow();
  updateCalculations();
}

initialize();
