import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBed, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/rooms", icon: <FaBed />, label: "Rooms" },
    { path: "/admin/bookings", icon: <FaCalendarAlt />, label: "Bookings" },
    { path: "/admin/messages", icon: <FaEnvelope />, label: "Messages" },
  ];

  return (
    <div className="admin-sidebar bg-dark text-white p-3" style={{ minHeight: "100vh" }}>
      <h3 className="mb-4">Admin Panel</h3>
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center gap-2 ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar; 