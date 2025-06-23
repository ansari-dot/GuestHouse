"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import {
  FaHotel,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEnvelope,
  FaChartLine,
  FaSignOutAlt,
  FaCog,
  FaUsers,
} from "react-icons/fa";
import AdminRoom from "./AdminRoom";
import AdminBookings from "./AdminBookings";
import AdminMessages from "./AdminMessages";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    rooms: { total: 0, available: 0, occupied: 0 },
    bookings: { total: 0, confirmed: 0, pending: 0, cancelled: 0, revenue: 0 },
    messages: { total: 0, unread: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 2780 },
    { name: "May", revenue: 1890 },
    { name: "Jun", revenue: 2390 },
  ];

  const bookingStatusData = [
    { name: "Confirmed", value: 75 },
    { name: "Pending", value: 15 },
    { name: "Cancelled", value: 10 },
  ];

  const COLORS = ["#4e73df", "#1cc88a", "#36b9cc"];

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axiosInstance.get("/admin");

        if (res.data.success && res.data.user.role === "admin") {
          setUser(res.data.user);
        } else {
          navigate("/admin-login");
        }
      } catch (err) {
        console.error("Admin verification failed:", err);
        navigate("/admin-login");
      }
    };

    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/stats");
        setDashboardStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin().then(fetchDashboard);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    document.cookie = "token=; Max-Age=0; path=/";
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.username}</h1>
        <p className="dashboard-subtitle">
          Here's what's happening with your hotel today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Rooms
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardStats.rooms.total}
                  </div>
                </div>
                <div className="col-auto">
                  <FaHotel className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Bookings
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardStats.bookings.total}
                  </div>
                </div>
                <div className="col-auto">
                  <FaCalendarAlt className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Revenue
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    ${dashboardStats.bookings.revenue}
                  </div>
                </div>
                <div className="col-auto">
                  <FaMoneyBillWave className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Messages
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {dashboardStats.messages.total}
                  </div>
                </div>
                <div className="col-auto">
                  <FaEnvelope className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Revenue Overview</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4e73df"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Booking Status</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "rooms":
        return <AdminRoom />;
      case "bookings":
        return <AdminBookings />;
      case "messages":
        return <AdminMessages />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Sardar House Admin</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    activeSection === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("dashboard")}>
                  <FaChartLine className="me-2" />
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    activeSection === "rooms" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("rooms")}>
                  <FaHotel className="me-2" />
                  Manage Rooms
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    activeSection === "bookings" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("bookings")}>
                  <FaCalendarAlt className="me-2" />
                  Manage Bookings
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    activeSection === "messages" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("messages")}>
                  <FaEnvelope className="me-2" />
                  Messages
                </button>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <span className="text-light me-3">
                <FaUsers className="me-2" />
                {user?.username}
              </span>
              <button className="btn btn-outline-light me-2">
                <FaCog className="me-2" />
                Settings
              </button>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
