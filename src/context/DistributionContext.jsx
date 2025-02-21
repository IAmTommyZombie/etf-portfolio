import React, { createContext, useContext, useState } from "react";

const DistributionContext = createContext();

export function DistributionProvider({ children }) {
  const [monthlyDistribution, setMonthlyDistribution] = useState(0);

  return (
    <DistributionContext.Provider
      value={{ monthlyDistribution, setMonthlyDistribution }}
    >
      {children}
    </DistributionContext.Provider>
  );
}

export function useDistribution() {
  return useContext(DistributionContext);
}
