import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { DistributionProvider } from "./context/DistributionContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthButton from "./components/auth/AuthButton";
import DashboardGrid from "./components/dashboard/DashboardGrid";
import PortfolioView from "./components/portfolio/PortfolioView";
import UserProfile from "./components/auth/UserProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DistributionManager from "./components/distributions/DistributionManager";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <DistributionProvider>
            <DashboardLayout>
              <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                      <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold">ETF Portfolio</h1>
                      </div>
                      <AuthButton />
                    </div>
                  </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<DashboardGrid />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/portfolio"
                      element={
                        <ProtectedRoute>
                          <PortfolioView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/distributions"
                      element={
                        <ProtectedRoute>
                          <DistributionManager />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </DashboardLayout>
          </DistributionProvider>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
