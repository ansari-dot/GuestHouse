"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import BookingModal from "../components/BookingModal";
import {
  fetchBookings,
  updateBookingStatus,
} from "../redux/slices/bookingsSlice";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaDownload,
} from "react-icons/fa";

const AdminBooking = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        return checkIn.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status }));
      dispatch(fetchBookings());
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleExportBookings = () => {
    console.log("Exporting bookings...");
    // Implement export logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container-fluid py-4">
      <motion.div
        className="bookings-management"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div>
            <h1 className="page-title">Booking Management</h1>
            <p className="page-subtitle text-muted">
              Manage reservations and guest bookings
            </p>
          </div>
          <button
            className="btn btn-outline-primary mt-2 mt-md-0"
            onClick={handleExportBookings}>
            <FaDownload className="me-2" />
            Export Bookings
          </button>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}>
              <FaFilter className="me-2" />
              Clear
            </button>
          </div>
        </div>

        {/* Booking Table */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Details</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>#{booking.id}</strong>
                    </td>
                    <td>
                      <strong>{booking.guestName || "N/A"}</strong>
                      <br />
                      <small className="text-muted">
                        {booking.email || "N/A"}
                      </small>
                      <br />
                      <small className="text-muted">
                        {booking.phone || "N/A"}
                      </small>
                    </td>
                    <td>{booking.roomName || "N/A"}</td>
                    <td>
                      {booking.checkIn
                        ? new Date(booking.checkIn).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {booking.checkOut
                        ? new Date(booking.checkOut).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{booking.guests || "N/A"}</td>
                    <td>
                      <strong>
                        ${booking.totalAmount?.toLocaleString() || "0"}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`badge bg-${getStatusColor(
                          booking.status
                        )}`}>
                        {booking.status?.charAt(0).toUpperCase() +
                          booking.status?.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleViewBooking(booking)}
                          title="View Details">
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            handleUpdateBookingStatus(booking.id, "confirmed")
                          }
                          disabled={booking.status === "confirmed"}
                          title="Confirm">
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleUpdateBookingStatus(booking.id, "cancelled")
                          }
                          disabled={booking.status === "cancelled"}
                          title="Cancel">
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filteredBookings.length === 0 && !loading && (
            <div className="text-center py-5">
              <h4>No bookings found</h4>
              <p className="text-muted">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        show={showModal}
        onHide={() => setShowModal(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default AdminBooking;
