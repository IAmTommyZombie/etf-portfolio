import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // Restore user from localStorage
  });
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Persist user to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Inactivity timeout (10 minutes = 600,000 ms)
  useEffect(() => {
    const checkInactivity = () => {
      if (Date.now() - lastActivity > 600000 && user) {
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    const resetTimer = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [user, lastActivity]);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
      const data = await response.json();
      setUser({ username: data.username });
      setLastActivity(Date.now());
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup failed");
      }
      const data = await response.json();
      setUser({ username: data.username });
      setLastActivity(Date.now());
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setLastActivity(Date.now());
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
