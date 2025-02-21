export const getPrices = async () => {
  const response = await fetch("http://localhost:3001/api/etf/prices");
  if (!response.ok) throw new Error("Failed to fetch prices");
  return response.json();
};

export const getDistributions = async () => {
  const response = await fetch("http://localhost:3001/api/etf/distributions");
  if (!response.ok) throw new Error("Failed to fetch distributions");
  return response.json();
};

export const deleteEtf = async (ticker) => {
  const response = await fetch(
    `http://localhost:3001/api/portfolio/${ticker}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete ETF");
  return response.json();
};
