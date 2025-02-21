import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { DISTRIBUTIONS } from "../../data/distributions";

const DistributionAdmin = () => {
  const { logout } = useAuth();
  const [distributions, setDistributions] = useState({});
  const [selectedETF, setSelectedETF] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Group ETFs by frequency
  const groupedETFs = Object.entries(DISTRIBUTIONS).reduce(
    (acc, [ticker, data]) => {
      const group =
        data.frequency === "weekly"
          ? "WEEKLY"
          : data.frequency === "13x" && ticker <= "FEAT"
          ? "GROUP_A"
          : data.frequency === "13x"
          ? "GROUP_B"
          : ticker <= "ABNY"
          ? "GROUP_C"
          : "GROUP_D";

      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push({ ticker, ...data });
      return acc;
    },
    {}
  );

  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/distributions");
        if (!response.ok) throw new Error("Failed to fetch distributions");
        const data = await response.json();
        setDistributions(data);
      } catch (error) {
        console.error("Error fetching distributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedETF || !amount) return;

    try {
      const response = await fetch("http://localhost:3001/api/distributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker: selectedETF,
          year,
          month,
          amount: amount === "TBD" ? "TBD" : parseFloat(amount),
        }),
      });

      if (!response.ok) throw new Error("Failed to update distribution");

      setAmount("");
      setEditMode(false);
      alert("Distribution updated successfully!");
    } catch (error) {
      console.error("Error updating distribution:", error);
      alert("Error updating distribution: " + error.message);
    }
  };

  // ... rest of your component code (handleEdit, getMonthName, render methods) ...
};

export default DistributionAdmin;
