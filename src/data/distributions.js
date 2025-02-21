// Sample distribution data structure
export const getDistribution = (ticker) => {
  const distributions = {
    // Weekly distributions
    YMAG: 0.12,
    YMAX: 0.11,
    LFGY: 0.1,
    GPTY: 0.09,

    // Group A
    TSLY: 0.15,
    GOOY: 0.14,
    YBIT: 0.13,
    OARK: 0.12,
    XOMO: 0.11,
    TSMY: 0.1,
    CRSH: 0.09,
    FIVY: 0.08,
    FEAT: 0.07,

    // Group B
    NVDY: 0.14,
    FBY: 0.13,
    GDXY: 0.12,
    JPMO: 0.11,
    MRNY: 0.1,
    MARO: 0.09,
    PLTY: 0.08,

    // Group C
    CONY: 0.13,
    MSFO: 0.12,
    AMDY: 0.11,
    NFLY: 0.1,
    PYPY: 0.09,
    ULTY: 0.08,
    ABNY: 0.07,

    // Group D
    MSTY: 0.12,
    AMZY: 0.11,
    APLY: 0.1,
    DISO: 0.09,
    SQY: 0.08,
    SMCY: 0.07,
    AIYY: 0.06,
  };

  return distributions[ticker] || 0;
};

export const DISTRIBUTIONS = {
  // Weekly distributions
  YMAG: { frequency: "weekly" },
  YMAX: { frequency: "weekly" },
  LFGY: { frequency: "weekly" },
  GPTY: { frequency: "weekly" },

  // Group A (13x)
  TSLY: { frequency: "13x" },
  GOOY: { frequency: "13x" },
  YBIT: { frequency: "13x" },
  OARK: { frequency: "13x" },
  XOMO: { frequency: "13x" },
  TSMY: { frequency: "13x" },
  CRSH: { frequency: "13x" },
  FIVY: { frequency: "13x" },
  FEAT: { frequency: "13x" },

  // Group B (13x)
  NVDY: { frequency: "13x" },
  FBY: { frequency: "13x" },
  GDXY: { frequency: "13x" },
  JPMO: { frequency: "13x" },
  MRNY: { frequency: "13x" },
  MARO: { frequency: "13x" },
  PLTY: { frequency: "13x" },

  // Group C
  CONY: { frequency: "monthly" },
  MSFO: { frequency: "monthly" },
  AMDY: { frequency: "monthly" },
  NFLY: { frequency: "monthly" },
  PYPY: { frequency: "monthly" },
  ULTY: { frequency: "monthly" },
  ABNY: { frequency: "monthly" },

  // Group D
  MSTY: { frequency: "monthly" },
  AMZY: { frequency: "monthly" },
  APLY: { frequency: "monthly" },
  DISO: { frequency: "monthly" },
  SQY: { frequency: "monthly" },
  SMCY: { frequency: "monthly" },
  AIYY: { frequency: "monthly" },
};
