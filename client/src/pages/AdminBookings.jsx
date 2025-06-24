import AdminSidebar from "../components/AdminSidebar";
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
        handleBookings(); // Refresh list
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking.");
    }
  };
  useEffect(() => {
    handleBookings();
  }, []);

  const bookings = [
    {
      id: 1,
      guestName: "John Doe",
      roomName: "Deluxe Room",
      checkIn: "2024-03-20",
      checkOut: "2024-03-25",
      status: "Confirmed",
    },
    {
      id: 2,
      guestName: "Jane Smith",
      roomName: "Suite",
      checkIn: "2024-03-22",
      checkOut: "2024-03-24",
      status: "Pending",
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 md-12 sm-12">
          <div className="d-flex">
            <AdminSidebar />
            <div className="flex-grow-1 p-4">
              <h2 className="mb-4">Manage Bookings</h2>
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Guest Name</th>
                          <th>Room</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>payment Method</th>
                          <th>email</th>
                          <th>Phone Number</th>
                          <th>total Amount</th>
                          <th>Special Request</th>
                          <th>Booking Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {booking.map((booking) => (
                          <tr key={booking}>
                            <td>{booking._id}</td>
                            <td>{booking.name}</td>
                            <td>{booking.checkIn}</td>
                            <td>{booking.checkOut}</td>
                            <td>{booking.paymentMethod}</td>
                            <td>{booking.phone}</td>
                            <td>{booking.email}</td>

                            <td>{booking.totalAmount}</td>
                            <td>{booking.specialRequests}</td>
                            {new Date(booking.createdAt).toLocaleString()}

                            <th>{booking.status || "pendingZ"}</th>
                            <td>
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
