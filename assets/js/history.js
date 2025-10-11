document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#history-table tbody");
  const emptyState = document.querySelector("#history-empty");

  function getHistory() {
    return JSON.parse(localStorage.getItem("giftCardHistory")) || [];
  }

  function formatDate(isoString) {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  function formatCurrency(value, currency) {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency
    }).format(value);
  }

  function renderHistory() {
    const history = getHistory();
    tableBody.innerHTML = "";

    if (history.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    history.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.referenceId}</td>
        <td>${record.code}</td>
        <td>${record.name}</td>
        <td>${record.redeemedBy}</td>
        <td>${record.contact || "-"}</td>
        <td>${formatCurrency(record.faceValue, record.currency)}</td>
        <td>${record.pointsRequired.toLocaleString()}</td>
        <td>${formatDate(record.redeemedAt)}</td>
        <td>${record.note || "-"}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  renderHistory();
});
