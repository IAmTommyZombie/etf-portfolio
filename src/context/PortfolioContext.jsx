import { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <PortfolioContext.Provider value={{ etfs, loading, setEtfs, setLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
