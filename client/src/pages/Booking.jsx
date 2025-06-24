import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchRooms } from "../redux/slices/roomsSlice";
import {
  FaCalendarAlt,
  FaUsers,
  FaBed,
  FaCreditCard,
  FaArrowLeft,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axios";

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms, loading, error } = useSelector((state) => state.rooms);
  const { user } = useSelector((state) => state.auth);

  const selectedRoomData = location.state?.selectedRoom;
  const roomId = location.state?.roomId;
  const roomType = location.state?.roomType;
  const roomPrice = location.state?.roomPrice;
  const roomNumber = location.state?.roomNumber;

  const [formData, setFormData] = useState({
    roomId: roomId || "",
    checkIn: "",
    checkOut: "",
    guests: selectedRoomData?.capacity || 1,
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paypalEmail: "",
    totalAmount: 0,
  });

  const [selectedRoom, setSelectedRoom] = useState(selectedRoomData || null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    dispatch(fetchRooms());
    checkPaymentStatus();
  }, [dispatch]);

  useEffect(() => {
    if (selectedRoomData) {
      setSelectedRoom(selectedRoomData);
      setFormData((prev) => ({
        ...prev,
        roomId: selectedRoomData._id || selectedRoomData.id,
        guests: selectedRoomData.capacity || 1,
      }));
    } else if (formData.roomId && Array.isArray(rooms)) {
      const room = rooms.find((r) => (r._id || r.id) === formData.roomId);
      setSelectedRoom(room);
    }
  }, [formData.roomId, rooms, selectedRoomData]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && selectedRoom) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff > 0) {
        setNights(daysDiff);
        const calculatedAmount = daysDiff * selectedRoom.price;
        setTotalAmount(calculatedAmount);
        setFormData((prev) => ({ ...prev, totalAmount: calculatedAmount }));
      } else {
        setNights(0);
        setTotalAmount(0);
        setFormData((prev) => ({ ...prev, totalAmount: 0 }));
      }
    }
  }, [formData.checkIn, formData.checkOut, selectedRoom]);

  const checkPaymentStatus = async () => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId");
    const status = params.get("status");

    if (bookingId && status) {
      try {
        if (status === "success") {
          const transactionId = params.get("transaction_id");
          const response = await axiosInstance.post("/booking/verify-payment", {
            bookingId,
            transactionId,
          });

          if (response.data.success) {
            toast.success("Payment confirmed! Your booking is now confirmed.", {
              position: "top-right",
              autoClose: 3000,
              theme: "light",
            });
            setBookingStatus("confirmed");
          } else {
            toast.error(
              "Payment verification failed. Please contact support.",
              {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
              }
            );
          }
        } else if (status === "failed") {
          toast.error("Payment failed. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
          });
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (err) {
        console.error("Payment status check error:", err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.roomId) {
      toast.error("Please select a room");
      return false;
    }
    if (!formData.checkIn || !formData.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return false;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required guest information");
      return false;
    }
    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }
    if (
      formData.paymentMethod === "credit_card" &&
      (!formData.cardNumber || !formData.expiryDate || !formData.cvv)
    ) {
      toast.error("Please fill in all credit card details");
      return false;
    }
    if (formData.paymentMethod === "paypal" && !formData.paypalEmail) {
      toast.error("Please enter your PayPal email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.warn("Please log in to submit a booking request.", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/booking", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        if (formData.paymentMethod === "fastpay" && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          toast.success(
            formData.paymentMethod === "cash_on_arrival"
              ? "Your booking has been confirmed!"
              : "Your booking request has been submitted successfully!",
            {
              position: "top-right",
              autoClose: 3000,
              theme: "light",
            }
          );
          setBookingId(response.data.bookingId);
        }
      } else {
        toast.error(
          response.data.message ||
            "Your booking request has failed! Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
          }
        );
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to submit booking. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMinCheckOutDate = () => {
    if (formData.checkIn) {
      const checkIn = new Date(formData.checkIn);
      checkIn.setDate(checkIn.getDate() + 1);
      return checkIn.toISOString().split("T")[0];
    }
    return getTomorrowDate();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <section
        className="page-hero"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg)",
        }}>
        <div className="hero-slide">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <h1 className="display-3 text-white mb-4">Book Your Stay</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-white">
                        Home
                      </a>
                    </li>
                    <li
                      className="breadcrumb-item active text-secondary"
                      aria-current="page">
                      Booking
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="mb-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/rooms")}>
              <FaArrowLeft className="me-2" />
              Back to Rooms
            </button>
          </div>

          {selectedRoom && (
            <div className="card border-0 shadow mb-4" data-aos="fade-up">
              <div className="card-body">
                <h5 className="card-title text-primary mb-3">Selected Room</h5>
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img
                      src={
                        selectedRoom.image
                          ? `${backendUrl}/uploads/${selectedRoom.image}`
                          : "/default-room.jpg"
                      }
                      alt={selectedRoom.type}
                      className="img-fluid rounded"
                      style={{
                        height: "120px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-md-9">
                    <h6 className="mb-2">
                      {selectedRoom.type} - Room #{selectedRoom.roomNumber}
                    </h6>
                    <p className="text-muted mb-2">
                      {selectedRoom.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-primary me-2">
                          ${selectedRoom.price}/night
                        </span>
                        <span className="badge bg-secondary me-2">
                          {selectedRoom.capacity} Guests
                        </span>
                        <span className="badge bg-info">
                          {selectedRoom.size} sq ft
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row g-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow" data-aos="fade-up">
                <div className="card-body p-4">
                  <h3 className="card-title text-primary mb-4">
                    Reservation Details
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 pb-4 border-bottom">
                      <h5 className="d-flex align-items-center mb-3">
                        <FaBed className="me-2 text-secondary" />
                        Select Room
                      </h5>
                      <div className="row">
                        <div className="col-12">
                          {selectedRoomData ? (
                            <div className="alert alert-info">
                              <strong>Pre-selected Room:</strong>{" "}
                              {selectedRoomData.type} - Room #
                              {selectedRoomData.roomNumber} ($
                              {selectedRoomData.price}/night)
                            </div>
                          ) : (
                            <select
                              className="form-select"
                              name="roomId"
                              value={formData.roomId}
                              onChange={handleInputChange}
                              required>
                              <option value="">Choose a room</option>
                              {Array.isArray(rooms) &&
                                rooms.map((room) => (
                                  <option
                                    key={room._id || room.id}
                                    value={room._id || room.id}>
                                    {room.type || "Unnamed Room"} - Room #
                                    {room.roomNumber} - ${room.price || 0}/night
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                      <h5 className="d-flex align-items-center mb-3">
                        <FaUsers className="me-2 text-secondary" />
                        Guest Information
                      </h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Number of Guests *
                          </label>
                          <select
                            className="form-select"
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            required>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num} Guest{num > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                      <h5 className="d-flex align-items-center mb-3">
                        <FaCalendarAlt className="me-2 text-secondary" />
                        Booking Dates
                      </h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Check-in Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleInputChange}
                            min={getTomorrowDate()}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Check-out Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleInputChange}
                            min={getMinCheckOutDate()}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-bottom">
                      <h5 className="d-flex align-items-center mb-3">
                        <FaCreditCard className="me-2 text-secondary" />
                        Payment Method
                      </h5>
                      <div className="row g-3">
                        <div className="col-12">
                          <select
                            className="form-select"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            required>
                            <option value="">Select payment method</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="fastpay">FastPay (Pakistan)</option>
                            <option value="cash_on_arrival">
                              Cash on Arrival
                            </option>
                          </select>
                        </div>

                        {formData.paymentMethod === "credit_card" && (
                          <>
                            <div className="col-md-6">
                              <label className="form-label">
                                Card Number *
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">
                                Expiry Date *
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                maxLength="5"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">CVV *</label>
                              <input
                                type="text"
                                className="form-control"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength="4"
                              />
                            </div>
                          </>
                        )}

                        {formData.paymentMethod === "paypal" && (
                          <div className="col-12">
                            <label className="form-label">PayPal Email *</label>
                            <input
                              type="email"
                              className="form-control"
                              name="paypalEmail"
                              value={formData.paypalEmail}
                              onChange={handleInputChange}
                              placeholder="your-email@paypal.com"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"></span>
                          Processing Booking...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="card border-0 shadow"
                data-aos="fade-up"
                data-aos-delay="100">
                <div className="card-body p-4">
                  <h4 className="card-title text-primary mb-4">
                    Booking Summary
                  </h4>

                  {selectedRoom && (
                    <div className="booking-summary">
                      <div className="room-info mb-3">
                        <h6 className="fw-bold">
                          {selectedRoom.type || "Selected Room"}
                        </h6>
                        <p className="text-muted mb-2">
                          Room #{selectedRoom.roomNumber || "N/A"} -{" "}
                          {selectedRoom.capacity || 0} Guests
                        </p>
                        <p className="text-muted mb-0">
                          {selectedRoom.description}
                        </p>
                      </div>

                      {formData.checkIn && formData.checkOut && (
                        <div className="booking-dates mb-3">
                          <h6 className="fw-bold">Dates</h6>
                          <p className="mb-1">
                            <strong>Check-in:</strong>{" "}
                            {new Date(formData.checkIn).toLocaleDateString()}
                          </p>
                          <p className="mb-0">
                            <strong>Check-out:</strong>{" "}
                            {new Date(formData.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-primary fw-bold">
                            {nights} night{nights !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}

                      <div className="price-breakdown">
                        <h6 className="fw-bold">Price Breakdown</h6>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Room rate per night:</span>
                          <span>${selectedRoom.price || 0}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Number of nights:</span>
                          <span>{nights}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total Amount:</span>
                          <span className="text-primary">${totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!selectedRoom && (
                    <div className="text-center text-muted">
                      <p>Please select a room to see booking summary</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Booking;
