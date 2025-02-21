export const ETF_DATA = {
  // Weekly Group
  YMAG: {
    name: "YieldMax GOOGL Option Income",
    group: "Weekly",
    frequency: "weekly",
  },
  YMAX: {
    name: "YieldMax AAPL Option Income",
    group: "Weekly",
    frequency: "weekly",
  },
  LFGY: {
    name: "YieldMax Growth Option Income",
    group: "Weekly",
    frequency: "weekly",
  },
  GPTY: {
    name: "YieldMax Growth & Tech Income",
    group: "Weekly",
    frequency: "weekly",
  },

  // Group A
  TSLY: {
    name: "YieldMax TSLA Option Income",
    group: "Group A",
    frequency: "13x",
  },
  GOOY: {
    name: "YieldMax GOOG Option Income",
    group: "Group A",
    frequency: "13x",
  },
  YBIT: {
    name: "YieldMax Bitcoin Option Income",
    group: "Group A",
    frequency: "13x",
  },
  OARK: {
    name: "YieldMax Innovation Option Income",
    group: "Group A",
    frequency: "13x",
  },
  XOMO: {
    name: "YieldMax MSFT Option Income",
    group: "Group A",
    frequency: "13x",
  },
  TSMY: {
    name: "YieldMax SEMI Option Income",
    group: "Group A",
    frequency: "13x",
  },
  CRSH: {
    name: "YieldMax COIN Option Income",
    group: "Group A",
    frequency: "13x",
  },
  FIVY: {
    name: "YieldMax FIVE Option Income",
    group: "Group A",
    frequency: "13x",
  },
  FEAT: {
    name: "YieldMax AI & Tech Option Income",
    group: "Group A",
    frequency: "13x",
  },

  // Group B
  NVDY: {
    name: "YieldMax NVDA Option Income",
    group: "Group B",
    frequency: "13x",
  },
  FBY: {
    name: "YieldMax META Option Income",
    group: "Group B",
    frequency: "13x",
  },
  GDXY: {
    name: "YieldMax GLD Option Income",
    group: "Group B",
    frequency: "13x",
  },
  JPMO: {
    name: "YieldMax JPM Option Income",
    group: "Group B",
    frequency: "13x",
  },
  MRNY: {
    name: "YieldMax MRNA Option Income",
    group: "Group B",
    frequency: "13x",
  },
  MARO: {
    name: "YieldMax MSTR Option Income",
    group: "Group B",
    frequency: "13x",
  },
  PLTY: {
    name: "YieldMax PLTR Option Income",
    group: "Group B",
    frequency: "13x",
  },

  // Group C
  CONY: {
    name: "YieldMax COIN Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },
  MSFO: {
    name: "YieldMax MSFT Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },
  AMDY: {
    name: "YieldMax AMD Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },
  NFLY: {
    name: "YieldMax NFLX Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },
  PYPY: {
    name: "YieldMax PYPL Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },
  ULTY: {
    name: "YieldMax QQQ Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },
  ABNY: {
    name: "YieldMax ABNB Option Income Strategy",
    group: "Group C",
    frequency: "monthly",
  },

  // Group D
  MSTY: {
    name: "YieldMax MSFT Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
  AMZY: {
    name: "YieldMax AMZN Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
  APLY: {
    name: "YieldMax AAPL Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
  DISO: {
    name: "YieldMax DIS Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
  SQY: {
    name: "YieldMax SQ Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
  SMCY: {
    name: "YieldMax SMH Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
  AIYY: {
    name: "YieldMax AI Option Income Strategy",
    group: "Group D",
    frequency: "monthly",
  },
};

export const GROUP_ORDER = [
  "Weekly",
  "Group A",
  "Group B",
  "Group C",
  "Group D",
];

export const GROUP_COLORS = {
  Weekly: "bg-gray-50 hover:bg-gray-100",
  "Group A": "bg-green-50 hover:bg-green-100",
  "Group B": "bg-yellow-50 hover:bg-yellow-100",
  "Group C": "bg-blue-50 hover:bg-blue-100",
  "Group D": "bg-red-50 hover:bg-red-100",
};

export const STATUS_STYLES = {
  Active: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  TBD: "bg-gray-100 text-gray-800",
};

export const getETFStatus = (price, distribution) => {
  if (!price || !distribution) return "TBD";
  if (distribution === "TBD") return "Pending";
  return "Active";
};
