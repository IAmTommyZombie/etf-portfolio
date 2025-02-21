export const getDashboardData = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/etf/prices");
    if (!response.ok) throw new Error("Failed to fetch dashboard data");
    const data = await response.json();

    return {
      totalValue: 0, // This will be calculated in the component
      totalShares: 0, // This will be calculated in the component
      monthlyIncome: 0, // This will be calculated in the component
      portfolioEtfs: data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      totalValue: 0,
      totalShares: 0,
      monthlyIncome: 0,
      portfolioEtfs: [],
    };
  }
};
