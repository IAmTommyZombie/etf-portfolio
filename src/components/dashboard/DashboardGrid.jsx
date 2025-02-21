import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ETF_GROUPS = {
  Weekly: ["YMAG", "YMAX", "LFGY", "GPTY"],
  "Group A": [
    "TSLY",
    "GOOY",
    "YBIT",
    "OARK",
    "XOMO",
    "TSMY",
    "CRSH",
    "FIVY",
    "FEAT",
  ],
  "Group B": ["NVDY", "FBY", "GDXY", "JPMO", "MRNY", "MARO", "PLTY"],
  "Group C": ["CONY", "MSFO", "AMDY", "NFLY", "PYPY", "ULTY", "ABNY"],
  "Group D": ["MSTY", "AMZY", "APLY", "DISO", "SQY", "SMCY", "AIYY"],
};

const GROUP_ORDER = ["Weekly", "Group A", "Group B", "Group C", "Group D"];
const GROUP_COLORS = {
  Weekly: "bg-purple-100",
  "Group A": "bg-blue-100",
  "Group B": "bg-green-100",
  "Group C": "bg-yellow-100",
  "Group D": "bg-red-100",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const DashboardGrid = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const priceResponse = await fetch(`${API_URL}/api/etf/prices`);
        if (!priceResponse.ok) throw new Error("Failed to fetch ETF prices");
        const priceData = await priceResponse.json();
        const priceMap = priceData.reduce((acc, item) => {
          acc[item.symbol] = {
            name: item.name,
            price: item.price,
            updatedAt: item.updatedAt,
          };
          return acc;
        }, {});
        setPrices(priceMap);

        if (isAuthenticated && user?.username) {
          const portfolioResponse = await fetch(
            `${API_URL}/api/portfolio/${user.username}`
          );
          if (!portfolioResponse.ok)
            throw new Error("Failed to fetch portfolio");
          const portfolioData = await portfolioResponse.json();
          setPortfolio(portfolioData);
        } else {
          setPortfolio([]);
        }

        setError(null);
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  const formatCurrency = (value) => `$${value.toFixed(2)}`;
  const formatTime = (timestamp) =>
    timestamp
      ? new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : "N/A";

  const groupedETFs = GROUP_ORDER.map((group) => ({
    group,
    etfs: ETF_GROUPS[group].map((ticker) => ({
      ticker,
      name: prices[ticker]?.name || ticker,
      price: prices[ticker]?.price || 0,
      updatedAt: prices[ticker]?.updatedAt,
      isHeld:
        isAuthenticated && portfolio.some((item) => item.ticker === ticker),
    })),
  }));

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-8 p-4">
      {groupedETFs.map(({ group, etfs }) => (
        <div key={group} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{group}</h3>
          </div>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell>Symbol</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {etfs.map((etf) => (
                    <TableRow
                      key={etf.ticker}
                      className={`${GROUP_COLORS[group]} ${
                        etf.isHeld ? "bg-gray-200 font-semibold" : ""
                      }`}
                    >
                      <TableCell className="font-medium">
                        {etf.ticker}
                      </TableCell>
                      <TableCell>{etf.name}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(etf.price)}
                      </TableCell>
                      <TableCell align="right">
                        {formatTime(etf.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;
