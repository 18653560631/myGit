(function () {
  const defaultGiftCards = [
    {
      code: "VIP100",
      name: "尊享会员储值卡",
      pointsRequired: 1200,
      faceValue: 100,
      currency: "CNY",
      balance: 100,
      category: "餐饮",
      description: "适用于全国连锁门店，可叠加店内活动使用。",
      status: "available",
      terms: "单笔订单限用一张，不可兑换现金。"
    },
    {
      code: "SPA299",
      name: "轻奢水疗体验卡",
      pointsRequired: 2800,
      faceValue: 299,
      currency: "CNY",
      balance: 299,
      category: "生活服务",
      description: "尊享 120 分钟套餐，可提前 3 天预约。",
      status: "available",
      terms: "节假日需另补差价 50 元，使用期限 90 天。"
    },
    {
      code: "HOTEL688",
      name: "五星酒店双早套房券",
      pointsRequired: 6200,
      faceValue: 688,
      currency: "CNY",
      balance: 688,
      category: "旅行",
      description: "含双人早餐和泳池使用，限周末兑换。",
      status: "available",
      terms: "需提前 5 天预约，逾期自动失效。"
    },
    {
      code: "COFFEE50",
      name: "咖啡连锁储值卡",
      pointsRequired: 600,
      faceValue: 50,
      currency: "CNY",
      balance: 50,
      category: "餐饮",
      description: "可用于全国 800+ 门店，到店扫码使用。",
      status: "reserved",
      terms: "限本人使用，可转赠好友。"
    }
  ];

  function initStore() {
    if (!window.localStorage) {
      return;
    }

    const cachedCards = localStorage.getItem("giftCardCatalog");
    const cachedHistory = localStorage.getItem("giftCardHistory");

    if (!cachedCards) {
      localStorage.setItem("giftCardCatalog", JSON.stringify(defaultGiftCards));
    }

    if (!cachedHistory) {
      localStorage.setItem("giftCardHistory", JSON.stringify([]));
    }
  }

  document.addEventListener("DOMContentLoaded", initStore);

  window.giftCardData = {
    defaultGiftCards,
    reset() {
      if (!window.localStorage) return;
      localStorage.setItem("giftCardCatalog", JSON.stringify(defaultGiftCards));
      localStorage.setItem("giftCardHistory", JSON.stringify([]));
    }
  };
})();
