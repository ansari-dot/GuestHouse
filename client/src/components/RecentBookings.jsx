import { FaCalendarAlt } from "react-icons/fa";

const RecentBookings = ({ bookings }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Recent Bookings</h5>
      </div>
      <div className="card-body">
        <div className="list-group">
          {bookings.map((booking) => (
            <div key={booking.id} className="list-group-item">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{booking.guestName}</h6>
                  <small className="text-muted">
                    <FaCalendarAlt className="me-1" />
                    {booking.checkIn} - {booking.checkOut}
                  </small>
                </div>
                <span
                  className={`badge ${
                    booking.status === "Confirmed"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentBookings; 