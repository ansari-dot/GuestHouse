import { FaUsers, FaBed, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

const DashboardWidgets = ({ stats }) => {
  const widgets = [
    {
      icon: <FaUsers />,
      title: "Total Users",
      value: stats.totalUsers || 0,
      color: "primary",
    },
    {
      icon: <FaBed />,
      title: "Total Rooms",
      value: stats.totalRooms || 0,
      color: "success",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Active Bookings",
      value: stats.activeBookings || 0,
      color: "warning",
    },
    {
      icon: <FaEnvelope />,
      title: "New Messages",
      value: stats.newMessages || 0,
      color: "info",
    },
  ];

  return (
    <div className="row g-4">
      {widgets.map((widget, index) => (
        <div key={index} className="col-md-3">
          <div className={`card bg-${widget.color} text-white`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title mb-0">{widget.title}</h6>
                  <h2 className="mt-2 mb-0">{widget.value}</h2>
                </div>
                <div className="fs-1">{widget.icon}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardWidgets; 