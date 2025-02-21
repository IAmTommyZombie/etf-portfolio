export const getPortfolioData = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/portfolio/${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch portfolio data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return {
      prices: [],
      portfolio: [],
    };
  }
};

export const updatePortfolio = async (userId, portfolioData) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/portfolio/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolio: portfolioData }),
      }
    );
    if (!response.ok) throw new Error("Failed to update portfolio");
    return await response.json();
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw error;
  }
};
