function formatNumber(value) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const concentrationForm = document.getElementById("concentration-form");
  const concentrationResult = document.getElementById("concentration-result");
  const targetForm = document.getElementById("target-form");
  const targetResult = document.getElementById("target-result");

  concentrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const saltWeight = Number(document.getElementById("salt-weight").value);
    const totalWeight = Number(document.getElementById("total-weight").value);

    if (!saltWeight || !totalWeight) {
      concentrationResult.textContent = "塩と総重量を入力してください。";
      return;
    }

    if (saltWeight > totalWeight) {
      concentrationResult.textContent = "塩の量は総重量以下にしてください。";
      return;
    }

    const concentration = (saltWeight / totalWeight) * 100;
    concentrationResult.textContent = `塩分濃度は約 ${formatNumber(concentration)} % です。`;
  });

  targetForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const targetPercent = Number(document.getElementById("target-percent").value);
    const targetTotalWeight = Number(
      document.getElementById("target-total-weight").value,
    );

    if (!targetPercent || !targetTotalWeight) {
      targetResult.textContent = "塩分濃度と総重量を入力してください。";
      return;
    }

    if (targetPercent > 100) {
      targetResult.textContent = "塩分濃度は100%以下で入力してください。";
      return;
    }

    const requiredSalt = (targetPercent / 100) * targetTotalWeight;
    targetResult.textContent = `必要な塩の量は約 ${formatNumber(requiredSalt)} g です。`;
  });
});
