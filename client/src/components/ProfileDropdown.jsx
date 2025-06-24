import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaSignOutAlt, 
  FaTimes, 
  FaUserCircle, 
  FaEnvelope, 
  FaRegIdCard,
  FaCog,
  FaHistory
} from "react-icons/fa";
import { logoutUser } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const profileImageUrl = user.profileImage ? `${backendUrl}/uploads/${user.profileImage}` : "/default-avatar.png";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
    setIsOpen(false);
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  const handleViewBookings = () => {
    navigate("/profile", { state: { activeTab: "bookings" } });
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate("/profile", { state: { activeTab: "password" } });
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        {user?.profileImage ? (
          <img 
            src={profileImageUrl} 
            alt={user.username} 
            className="profile-image"
          />
        ) : (
          <FaUserCircle className="profile-icon" />
        )}
      </button>

      {isOpen && (
        <div className="profile-menu">
          <div className="profile-header">
            <div className="profile-header-content">
              <div className="profile-avatar">
                {user?.profileImage ? (
                  <img 
                    src={profileImageUrl} 
                    alt={user.username} 
                    className="profile-image-large"
                  />
                ) : (
                  <FaUserCircle className="profile-icon-large" />
                )}
              </div>
              <div className="profile-title">
                <h3>{user?.username}</h3>
                <p className="text-muted">{user?.email}</p>
              </div>
            </div>
            <button 
              className="close-button" 
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className="profile-actions">
            <button className="action-button" onClick={handleViewProfile}>
              <FaRegIdCard />
              <span>View Profile</span>
            </button>
            <button className="action-button" onClick={handleViewBookings}>
              <FaHistory />
              <span>My Bookings</span>
            </button>
            <button className="action-button" onClick={handleSettings}>
              <FaCog />
              <span>Settings</span>
            </button>
            <div className="divider"></div>
            <button className="action-button logout-button" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 