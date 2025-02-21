import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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

const AddETFForm = ({ onClose, onAddSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ticker: "",
    totalShares: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user || !user.username) throw new Error("User not authenticated");

      const selectedTicker = formData.ticker;
      const totalShares = Number(formData.totalShares);

      if (isNaN(totalShares)) throw new Error("Shares must be a valid number");

      const priceResponse = await fetch(
        `${API_URL}/api/yahoo/price/${selectedTicker}`
      );
      if (!priceResponse.ok)
        throw new Error(`Failed to fetch price for ${selectedTicker}`);
      const { price } = await priceResponse.json();

      if (!price)
        throw new Error(`Could not get current price for ${selectedTicker}`);

      const portfolioData = {
        ticker: selectedTicker,
        totalShares,
        purchaseDate: formData.purchaseDate,
        purchasePrice: price,
      };

      const response = await fetch(
        `${API_URL}/api/portfolio/${user.username}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(portfolioData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add ETF");
      }

      onAddSuccess();
      onClose();
    } catch (error) {
      alert("Error adding ETF: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add ETF</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select ETF
            </label>
            <div className="relative">
              <select
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                required
                disabled={loading}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Shares
            </label>
            <input
              type="number"
              name="totalShares"
              value={formData.totalShares}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter number of shares"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {loading ? "Adding..." : "Add ETF"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddETFForm;
