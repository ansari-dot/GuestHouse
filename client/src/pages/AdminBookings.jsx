import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminBookings = () => {
  const [booking, setBooking] = useState([]);

  const handleBookings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/get/booking");
      console.log(response.data);
      setBooking(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/confirm/${bookingId}`
      );
      if (response.status === 200) {
        alert("Booking confirmed and email sent!");
        handleBookings(); // Refresh the list
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking.");
    }
  };

  useEffect(() => {
    handleBookings();
  }, []);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Manage Bookings</h2>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Guest Name</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Payment Method</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Amount</th>
                  <th>Special Request</th>
                  <th>Booking Time</th>
                  <th>Status</th>
                  <th>Confirm</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {booking.map((b) => (
                  <tr key={b._id}>
                    <td>{b._id}</td>
                    <td>{b.name}</td>
                    <td>{b.roomName || "N/A"}</td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td>{b.paymentMethod}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>${b.totalAmount}</td>
                    <td>{b.specialRequests || "N/A"}</td>
                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          b.status === "Confirmed" ? "success" : "warning"
                        }`}>
                        {b.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      {b.status !== "Confirmed" && (
                        <button
                          onClick={() => confirmBooking(b._id)}
                          className="btn btn-success btn-sm">
                          Confirm
                        </button>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-success me-2">
                        <FaCheck />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
                {booking.length === 0 && (
                  <tr>
                    <td colSpan="14" className="text-center text-muted">
                      No bookings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
