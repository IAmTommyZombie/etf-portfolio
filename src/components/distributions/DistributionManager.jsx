import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Edit2, X, ChevronDown } from "lucide-react";

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const DistributionManager = () => {
  const { user, isAuthenticated } = useAuth();
  const [distributions, setDistributions] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDistribution, setNewDistribution] = useState({
    etfSymbol: "",
    amount: "",
    date: "",
  });
  const [editDistribution, setEditDistribution] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [user, isAuthenticated]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const distResponse = await fetch(
        `${API_URL}/api/distributions/${user.username}`
      );
      if (!distResponse.ok) throw new Error("Failed to fetch distributions");
      const distData = await distResponse.json();
      setDistributions(distData);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(
        `${API_URL}/api/distributions/${user.username}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDistribution),
        }
      );
      if (!response.ok) throw new Error("Failed to add distribution");

      fetchData();
      setNewDistribution({ etfSymbol: "", amount: "", date: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (dist) => {
    setEditDistribution({ ...dist });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `${API_URL}/api/distributions/${user.username}/${editDistribution.id}`,
        {
          method: "DELETE",
        }
      );

      const response = await fetch(
        `${API_URL}/api/distributions/${user.username}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            etfSymbol: editDistribution.etfSymbol,
            amount: Number(editDistribution.amount),
            date: editDistribution.date,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update distribution");

      fetchData();
      setShowEditModal(false);
      setEditDistribution(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/distributions/${user.username}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete distribution");
      fetchData();
      setShowEditModal(false);
      setEditDistribution(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDistribution({ ...newDistribution, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDistribution({ ...editDistribution, [name]: value });
  };

  if (!isAuthenticated) return <Navigate to="/" />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manage ETF Distributions</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">Add New Distribution</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select ETF
            </label>
            <div className="relative">
              <select
                name="etfSymbol"
                value={newDistribution.etfSymbol}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select an ETF</option>
                {Object.entries(ETF_GROUPS).map(([group, tickers]) => (
                  <optgroup key={group} label={group}>
                    {tickers.map((ticker) => (
                      <option key={ticker} value={ticker}>
                        {ticker}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={newDistribution.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={newDistribution.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Distribution
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Distributions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {distributions.map((dist) => (
                <tr key={dist.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dist.etfSymbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prices[dist.etfSymbol]?.name || dist.etfSymbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(prices[dist.etfSymbol]?.price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(
                      prices[dist.etfSymbol]?.updatedAt || ""
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${dist.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(dist.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(dist)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Distribution</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select ETF
                </label>
                <div className="relative">
                  <select
                    name="etfSymbol"
                    value={editDistribution.etfSymbol}
                    onChange={handleEditChange}
                    required
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 appearance-none"
                  >
                    <option value="">Select an ETF</option>
                    {Object.entries(ETF_GROUPS).map(([group, tickers]) => (
                      <optgroup key={group} label={group}>
                        {tickers.map((ticker) => (
                          <option key={ticker} value={ticker}>
                            {ticker}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editDistribution.amount}
                  onChange={handleEditChange}
                  name="amount"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={editDistribution.date}
                  onChange={handleEditChange}
                  name="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => handleDelete(editDistribution.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionManager;
