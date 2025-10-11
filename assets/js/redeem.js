document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#redeem-form");
  const cardSelect = document.querySelector("#card-code");
  const summaryName = document.querySelector("#summary-name");
  const summaryValue = document.querySelector("#summary-value");
  const summaryPoints = document.querySelector("#summary-points");
  const summaryDescription = document.querySelector("#summary-description");
  const feedback = document.querySelector("#feedback");
  const btnReset = document.querySelector("#reset-storage");

  function getCatalog() {
    const catalog = JSON.parse(localStorage.getItem("giftCardCatalog")) || [];
    return catalog;
  }

  function saveCatalog(list) {
    localStorage.setItem("giftCardCatalog", JSON.stringify(list));
  }

  function addHistory(entry) {
    const history = JSON.parse(localStorage.getItem("giftCardHistory")) || [];
    history.unshift(entry);
    localStorage.setItem("giftCardHistory", JSON.stringify(history));
  }

  function formatCurrency(value, currency) {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency
    }).format(value);
  }

  function populateOptions() {
    const catalog = getCatalog();
    cardSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "请选择要兑换的礼品卡";
    placeholder.disabled = true;
    placeholder.selected = true;
    cardSelect.appendChild(placeholder);

    let firstAvailable = "";
    catalog.forEach((card) => {
      const option = document.createElement("option");
      option.value = card.code;
      const statusLabel = card.status === "redeemed" ? "(已兑完)" : card.status === "reserved" ? "(已锁定)" : "";
      option.textContent = `${card.name} - ${card.code} ${statusLabel}`;
      option.disabled = card.status !== "available";
      cardSelect.appendChild(option);
      if (!option.disabled && !firstAvailable) {
        firstAvailable = option.value;
      }
    });

    if (catalog.length === 0) {
      placeholder.textContent = "暂无可兑换礼品卡";
      return;
    }

    if (firstAvailable) {
      cardSelect.value = firstAvailable;
    }
  }

  function updateSummary(code) {
    const catalog = getCatalog();
    const card = catalog.find((item) => item.code === code);
    if (!card) {
      summaryName.textContent = "选择礼品卡后展示详情";
      summaryValue.textContent = "-";
      summaryPoints.textContent = "-";
      summaryDescription.textContent = "";
      return;
    }

    summaryName.textContent = card.name;
    summaryValue.textContent = formatCurrency(card.faceValue, card.currency);
    summaryPoints.textContent = `${card.pointsRequired.toLocaleString()} 积分`;
    summaryDescription.innerHTML = `所属品类：${card.category} · 当前状态：<strong>${translateStatus(card.status)}</strong><br />${card.description}<br /><small>使用须知：${card.terms}</small>`;
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

  function setFeedback(type, message) {
    feedback.className = `alert ${type === "success" ? "alert-success" : "alert-error"}`;
    feedback.textContent = message;
  }

  function clearFeedback() {
    feedback.className = "";
    feedback.textContent = "";
  }

  populateOptions();

  updateSummary(cardSelect.value);

  cardSelect.addEventListener("change", (event) => {
    updateSummary(event.target.value);
    clearFeedback();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFeedback();

    const formData = new FormData(form);
    const code = formData.get("card-code");
    const userId = formData.get("member-id").trim();
    const contact = formData.get("contact").trim();
    const note = formData.get("note").trim();

    if (!code) {
      setFeedback("error", "请选择要兑换的礼品卡");
      return;
    }

    if (!userId) {
      setFeedback("error", "请输入会员编号");
      return;
    }

    const catalog = getCatalog();
    const cardIndex = catalog.findIndex((item) => item.code === code);
    const card = catalog[cardIndex];

    if (!card) {
      setFeedback("error", "找不到该礼品卡，请刷新重试");
      return;
    }

    if (card.status !== "available") {
      setFeedback("error", `该礼品卡当前状态为「${translateStatus(card.status)}」，无法兑换。`);
      return;
    }

    const redeemedAt = new Date();
    const referenceId = `EX${redeemedAt.getFullYear()}${(redeemedAt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${redeemedAt.getDate().toString().padStart(2, "0")}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    catalog[cardIndex] = {
      ...card,
      status: "redeemed",
      balance: 0,
      redeemedBy: userId,
      redeemedContact: contact,
      redeemedNote: note,
      redeemedAt: redeemedAt.toISOString(),
      referenceId
    };

    saveCatalog(catalog);

    addHistory({
      code: card.code,
      name: card.name,
      redeemedBy: userId,
      contact,
      note,
      redeemedAt: redeemedAt.toISOString(),
      referenceId,
      faceValue: card.faceValue,
      currency: card.currency,
      pointsRequired: card.pointsRequired
    });

    setFeedback(
      "success",
      `兑换成功！凭证号 ${referenceId} 已生成，可为会员 ${userId} 安排发放。`
    );

    form.reset();
    populateOptions();
    updateSummary(cardSelect.value);
  });

  btnReset?.addEventListener("click", () => {
    if (!confirm("确定要重置所有演示数据？")) {
      return;
    }
    window.giftCardData?.reset();
    populateOptions();
    updateSummary(cardSelect.value);
    clearFeedback();
  });
});
