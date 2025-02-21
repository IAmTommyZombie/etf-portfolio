import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthButton = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }); // e.g., "February 21, 2025"

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
              {user.username}
            </span>
            <span className="text-sm text-gray-600">{today}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButton;
