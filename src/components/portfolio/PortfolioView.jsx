import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  DollarSign,
  BarChart3,
  PieChart,
  Clock,
  X,
} from "lucide-react";
import AddETFForm from "./AddETFForm";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

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

const PortfolioView = () => {
  const { user, isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedETF, setSelectedETF] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchPortfolioData();
      const interval = setInterval(fetchPortfolioData, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [user, isAuthenticated]);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);

      const portfolioResponse = await fetch(
        `${API_URL}/api/portfolio/${user.username}`
      );
      if (!portfolioResponse.ok)
        throw new Error("Failed to fetch portfolio data");
      const portfolioData = await portfolioResponse.json();
      console.log("Raw portfolio data:", portfolioData);
      setPortfolio(portfolioData || []);

      const distResponse = await fetch(
        `${API_URL}/api/distributions/${user.username}`
      );
      if (!distResponse.ok) throw new Error("Failed to fetch distributions");
      const distData = await distResponse.json();
      setDistributions(distData || []);

      const pricesResponse = await fetch(`${API_URL}/api/etf/prices`);
      if (!pricesResponse.ok) throw new Error("Failed to fetch prices");
      const pricesData = await pricesResponse.json();
      const priceMap = pricesData.reduce((acc, item) => {
        acc[item.symbol] = {
          name: item.name,
          price: item.price,
          updatedAt: item.updatedAt,
        };
        return acc;
      }, {});
      setPrices(priceMap);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteETF = async (ticker) => {
    try {
      if (!window.confirm(`Are you sure you want to delete ${ticker}?`)) return;
      const response = await fetch(
        `${API_URL}/api/portfolio/${user.username}/${ticker}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error(`Failed to delete ${ticker}`);
      await fetchPortfolioData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleHistory = (etf) => {
    setSelectedETF(etf);
    setShowHistoryModal(true);
  };

  const handleAddSuccess = () => {
    fetchPortfolioData();
  };

  const getLatestDistributionAmount = (ticker) => {
    const dist = distributions.find((d) => d.etfSymbol === ticker);
    return dist ? dist.amount : 0;
  };

  const getBreakEvenInfo = (etf, currentMonthEnd) => {
    const costToBreakEven = etf.purchasePrice * etf.totalShares;
    const monthlyDist =
      getLatestDistributionAmount(etf.ticker) * etf.totalShares;
    const purchaseDate = new Date(etf.earliestPurchaseDate || etf.purchaseDate);
    const monthsOwned = Math.max(
      0,
      (currentMonthEnd.getFullYear() - purchaseDate.getFullYear()) * 12 +
        (currentMonthEnd.getMonth() - purchaseDate.getMonth())
    );
    const totalDistReceived = monthlyDist * monthsOwned;
    const breakEvenValue = totalDistReceived - costToBreakEven;
    const remainingToBreakEven = costToBreakEven - totalDistReceived;
    const monthsToBreakEven =
      monthlyDist > 0 && remainingToBreakEven > 0
        ? Math.ceil(remainingToBreakEven / monthlyDist)
        : 0;

    return {
      breakEvenValue,
      monthsToBreakEven:
        breakEvenValue >= 0 ? "Broken even" : `${monthsToBreakEven} months`,
      isBrokenEven: breakEvenValue >= 0,
    };
  };

  const getGroupForTicker = (ticker) => {
    for (const [group, tickers] of Object.entries(ETF_GROUPS)) {
      if (tickers.includes(ticker)) return group;
    }
    return "Other";
  };

  const groupByMonthWithCarryover = () => {
    const months = {};
    const sortedPortfolio = [...portfolio].sort(
      (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
    );

    // Aggregate shares by month and ticker
    sortedPortfolio.forEach((etf) => {
      const purchaseDate = new Date(etf.purchaseDate);
      if (purchaseDate < new Date("2023-01-01")) return;

      const monthYear = purchaseDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!months[monthYear]) months[monthYear] = {};

      if (!months[monthYear][etf.ticker]) {
        months[monthYear][etf.ticker] = { ...etf, totalShares: 0 };
        months[monthYear][etf.ticker].earliestPurchaseDate = etf.purchaseDate;
      }
      months[monthYear][etf.ticker].totalShares += etf.totalShares;
    });

    // Build result with cumulative totals
    const result = {};
    const allMonths = Object.keys(months).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    let runningTotals = {};

    allMonths.forEach((monthYear) => {
      const monthPurchases = months[monthYear];
      Object.entries(monthPurchases).forEach(([ticker, etf]) => {
        if (!runningTotals[ticker]) {
          runningTotals[ticker] = { ...etf, totalShares: 0 };
          runningTotals[ticker].earliestPurchaseDate = etf.purchaseDate;
        }
        runningTotals[ticker].totalShares += etf.totalShares;
        runningTotals[ticker].purchasePrice = etf.purchasePrice; // Latest price for simplicity
      });
      result[monthYear] = Object.values(runningTotals).map((etf) => ({
        ...etf,
      }));
    });

    console.log("Grouped Portfolio:", result);
    return result;
  };

  const calculateMonthTotals = (etfs) => {
    const totalValue = etfs.reduce(
      (acc, etf) => acc + (prices[etf.ticker]?.price || 0) * etf.totalShares,
      0
    );
    const totalIncome = etfs.reduce((acc, etf) => {
      const distAmount = getLatestDistributionAmount(etf.ticker);
      return acc + distAmount * etf.totalShares;
    }, 0);
    return { totalValue, totalIncome };
  };

  const getPortfolioSummary = () => {
    const groupedPortfolio = groupByMonthWithCarryover();
    let totalValue = 0;
    let totalAnnualIncome = 0;
    let totalShares = 0;

    Object.values(groupedPortfolio).forEach((etfs) => {
      const { totalValue: monthValue, totalIncome: monthIncome } =
        calculateMonthTotals(etfs);
      totalAnnualIncome += monthIncome;
      totalShares = etfs.reduce((acc, etf) => acc + etf.totalShares, 0);
    });

    totalValue =
      Object.values(groupedPortfolio)
        .slice(-1)[0]
        ?.reduce(
          (acc, etf) =>
            acc + (prices[etf.ticker]?.price || 0) * etf.totalShares,
          0
        ) || 0;

    return { totalValue, totalAnnualIncome, totalShares };
  };

  const { totalValue, totalAnnualIncome, totalShares } = getPortfolioSummary();

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  const groupedPortfolio = groupByMonthWithCarryover();

  const years = ["2023", "2024", "2025"];
  const filteredPortfolio = Object.entries(groupedPortfolio).filter(
    ([monthYear]) => monthYear.includes(selectedYear)
  );

  const renderTableHeader = () => (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Ticker
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Shares
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Price
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Value
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Distribution Amount
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Monthly Income
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Break Even
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Time to Break Even
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );

  const renderTableRow = (etf, monthYear) => {
    const distAmount = getLatestDistributionAmount(etf.ticker);
    const monthlyIncome = distAmount * etf.totalShares;
    const value = (prices[etf.ticker]?.price || 0) * etf.totalShares;
    const monthEnd = new Date(monthYear + " 1");
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    const { breakEvenValue, monthsToBreakEven, isBrokenEven } =
      getBreakEvenInfo(etf, monthEnd);
    const group = getGroupForTicker(etf.ticker);

    return (
      <tr key={etf.ticker} className={GROUP_COLORS[group] || "bg-gray-50"}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {etf.ticker}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {prices[etf.ticker]?.name || etf.ticker}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {etf.totalShares}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${(prices[etf.ticker]?.price || 0).toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${value.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${distAmount.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${monthlyIncome.toFixed(2)}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            isBrokenEven ? "text-green-600" : "text-red-600"
          }`}
        >
          {isBrokenEven ? "+" : ""}
          {formatCurrency(breakEvenValue)}
        </td>
        <td
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            isBrokenEven ? "text-green-600" : "text-red-600"
          }`}
        >
          {monthsToBreakEven}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
          <button
            onClick={() => handleDeleteETF(etf.ticker)}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleHistory(etf)}
            className="text-blue-600 hover:text-blue-900"
            title="History"
          >
            <Clock className="h-5 w-5" />
          </button>
        </td>
      </tr>
    );
  };

  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="relative w-full min-h-full bg-gray-100">
      <div className="absolute inset-0 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Portfolio Value
              </h2>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Total Annual Income
              </h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(totalAnnualIncome)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Total Shares
              </h2>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalShares.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Your Portfolio
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your ETF positions
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New ETF
            </button>
          </div>
          <div className="flex space-x-4 mt-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedYear === year
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-red-600">Error: {error}</div>
          </div>
        ) : portfolio.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Your Portfolio is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start building your portfolio by adding your first ETF position.
            </p>
          </div>
        ) : (
          filteredPortfolio.map(([monthYear, etfs]) => {
            const { totalValue: monthValue, totalIncome: monthIncome } =
              calculateMonthTotals(etfs);
            return (
              <div key={monthYear} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {monthYear}
                </h2>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      {renderTableHeader()}
                      <tbody className="bg-white divide-y divide-gray-200">
                        {etfs.map((etf) => renderTableRow(etf, monthYear))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-700">
                    <p>
                      <strong>Total Value:</strong> {formatCurrency(monthValue)}
                    </p>
                    <p>
                      <strong>Total Income:</strong>{" "}
                      {formatCurrency(monthIncome)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {showAddModal && (
          <AddETFForm
            onClose={() => setShowAddModal(false)}
            onAddSuccess={handleAddSuccess}
          />
        )}
        {showHistoryModal && selectedETF && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Purchase History for {selectedETF.ticker}
                </h2>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                <p>
                  Purchased {selectedETF.totalShares} shares on{" "}
                  {new Date(selectedETF.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioView;
