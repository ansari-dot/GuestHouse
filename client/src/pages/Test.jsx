import React, { useState, useEffect } from "react";
import axios from "axios";

const Test = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch booking data
  const getBooking = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/get/booking");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Confirm booking by ID
  const confirmBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/confirm/${bookingId}`
      );
      if (response.status === 200) {
        alert("Booking confirmed and email sent!");
        getBooking(); // Refresh list
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking.");
    }
  };

  useEffect(() => {
    getBooking();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Booking Details</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <div
            key={booking._id || index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}>
            <p>
              <strong>Guest Name:</strong> {booking.name}
            </p>
            <p>
              <strong>Email:</strong> {booking.email}
            </p>
            <p>
              <strong>Phone:</strong> {booking.phone}
            </p>
            <p>
              <strong>Room ID:</strong> {booking.roomId}
            </p>
            <p>
              <strong>Check-In:</strong> {booking.checkIn}
            </p>
            <p>
              <strong>Check-Out:</strong> {booking.checkOut}
            </p>
            <p>
              <strong>No. of Guests:</strong> {booking.guests}
            </p>
            <p>
              <strong>Payment Method:</strong> {booking.paymentMethod}
            </p>
            <p>
              <strong>Total Amount:</strong> PKR {booking.totalAmount}
            </p>
            <p>
              <strong>Status:</strong> {booking.status || "Pending"}
            </p>
            <p>
              <strong>Booking Time:</strong>{" "}
              {new Date(booking.createdAt).toLocaleString()}
            </p>

            {booking.status !== "Confirmed" && (
              <button
                onClick={() => confirmBooking(booking._id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}>
                Confirm Booking
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Test;
