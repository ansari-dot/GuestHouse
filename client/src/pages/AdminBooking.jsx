"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import AdminSidebar from "../components/AdminSidebar"
import BookingModal from "../components/BookingModal"
import { fetchBookings, updateBookingStatus } from "../redux/slices/bookingsSlice"
import { FaEye, FaEdit, FaTrash, FaSearch, FaFilter, FaDownload, FaCheck, FaTimes } from "react-icons/fa"

const AdminBooking = () => {
  const dispatch = useDispatch()
  const { bookings, loading, error } = useSelector((state) => state.bookings)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [filteredBookings, setFilteredBookings] = useState([])

  useEffect(() => {
    dispatch(fetchBookings())
  }, [dispatch])

  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.roomName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((booking) => {
        const checkIn = new Date(booking.checkIn)
        return checkIn.toDateString() === filterDate.toDateString()
      })
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, dateFilter])

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status }))
      dispatch(fetchBookings())
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const handleExportBookings = () => {
    // Export functionality would be implemented here
    console.log("Exporting bookings...")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <motion.div
          className="bookings-management"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="page-header">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h1 className="page-title">Booking Management</h1>
                  <p className="page-subtitle">Manage reservations and guest bookings</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <button className="btn btn-outline-primary" onClick={handleExportBookings}>
                    <FaDownload className="me-2" />
                    Export Bookings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="container-fluid">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
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
                      setSearchTerm("")
                      setStatusFilter("all")
                      setDateFilter("")
                    }}
                  >
                    <FaFilter className="me-2" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bookings-table">
            <div className="container-fluid">
              <div className="table-card">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
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
                              <div className="guest-details">
                                <strong>{booking.guestName || "N/A"}</strong>
                                <br />
                                <small className="text-muted">{booking.email || "N/A"}</small>
                                <br />
                                <small className="text-muted">{booking.phone || "N/A"}</small>
                              </div>
                            </td>
                            <td>{booking.roomName || "N/A"}</td>
                            <td>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}</td>
                            <td>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}</td>
                            <td>{booking.guests || "N/A"}</td>
                            <td>
                              <strong>${booking.totalAmount?.toLocaleString() || "0"}</strong>
                            </td>
                            <td>
                              <span className={`badge bg-${getStatusColor(booking.status)}`}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-info me-1"
                                  onClick={() => handleViewBooking(booking)}
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-success me-1"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                  disabled={booking.status === 'confirmed'}
                                  title="Confirm"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                  disabled={booking.status === 'cancelled'}
                                  title="Cancel"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                      <div className="empty-state text-center py-5">
                        <h3>No bookings found</h3>
                        <p className="text-muted">Try adjusting your search criteria.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal show={showModal} onHide={() => setShowModal(false)} booking={selectedBooking} />
    </div>
  )
}

export default AdminBooking
