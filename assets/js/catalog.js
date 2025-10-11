document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#card-list");
  const filterSelect = document.querySelector("#status-filter");

  function getCatalog() {
    return JSON.parse(localStorage.getItem("giftCardCatalog")) || [];
  }

  function translateStatus(status) {
    switch (status) {
      case "available":
        return "可兑换";
      case "reserved":
        return "已锁定";
      case "redeemed":
        return "已兑完";
      default:
        return "未知";
    }
  }

  function formatCurrency(value, currency) {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency
    }).format(value);
  }

  function renderCatalog() {
    const catalog = getCatalog();
    const filter = filterSelect.value;
    list.innerHTML = "";

    const filtered = catalog.filter((card) => (filter === "all" ? true : card.status === filter));

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "暂无符合条件的礼品卡";
      list.appendChild(empty);
      return;
    }

    filtered.forEach((card) => {
      const item = document.createElement("div");
      item.className = "card";
      item.innerHTML = `
        <h3>${card.name}</h3>
        <p>${card.description}</p>
        <div class="summary">
          <strong>${formatCurrency(card.faceValue, card.currency)}</strong>
          <span>${card.pointsRequired.toLocaleString()} 积分可兑</span>
          <span>兑换码：${card.code}</span>
          <span>当前状态：${translateStatus(card.status)}</span>
        </div>
        <p><small>使用须知：${card.terms}</small></p>
      `;
      list.appendChild(item);
    });
  }

  filterSelect.addEventListener("change", renderCatalog);

  renderCatalog();
});
