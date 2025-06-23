const QuickActions = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Quick Actions</h5>
      </div>
      <div className="card-body">
        <button className="btn btn-primary w-100 mb-2">Add New Room</button>
        <button className="btn btn-success w-100 mb-2">View Bookings</button>
        <button className="btn btn-info w-100">Send Message</button>
      </div>
    </div>
  );
};

export default QuickActions; 