import AdminSidebar from "../components/AdminSidebar";
import { FaCheck, FaTimes } from "react-icons/fa";

const AdminBookings = () => {
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
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.guestName}</td>
                      <td>{booking.roomName}</td>
                      <td>{booking.checkIn}</td>
                      <td>{booking.checkOut}</td>
                      <td>
                        <span
                          className={`badge ${
                            booking.status === "Confirmed"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {booking.status}
                        </span>
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
  );
};

export default AdminBookings; 