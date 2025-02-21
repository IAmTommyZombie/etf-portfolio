import React, { useState } from "react";
import {
  BarChart3,
  PieChart,
  Settings,
  Home,
  Menu,
  X,
  Plus,
  ClipboardList,
  LayoutGrid,
  Wallet,
  User,
  DollarSign,
} from "lucide-react";
import AddETFForm from "../portfolio/AddETFForm";
import Notification from "../ui/Notification";
import DashboardGrid from "../dashboard/DashboardGrid";
import PortfolioView from "../portfolio/PortfolioView";
import SettingsView from "../portfolio/SettingsView";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddETFModal, setShowAddETFModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentView, setCurrentView] = useState("overview");
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    { name: "Distributions", href: "/distributions", icon: DollarSign },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "overview":
        return <DashboardGrid />;
      case "portfolio":
        return <PortfolioView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar for larger screens */}
        <div
          className={`md:flex md:flex-col md:w-64 bg-white ${
            isSidebarOpen ? "flex flex-col w-64 absolute z-50 h-full" : "hidden"
          } md:relative`}
        >
          <div className="flex items-center justify-between h-16 px-4 md:justify-start">
            <span className="text-xl font-semibold">ETF Portfolio</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 px-2 pb-4 space-y-1">
            <nav>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        location.pathname === item.href
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsSidebarOpen(false);
                  }}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
                >
                  <X className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
            <span className="text-xl font-semibold">ETF Portfolio</span>
            <button onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>

      {showAddETFModal && (
        <AddETFForm
          onClose={() => setShowAddETFModal(false)}
          onSuccess={(message) => setNotification({ type: "success", message })}
        />
      )}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
