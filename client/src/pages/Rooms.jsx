import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBed, FaUsers, FaRulerCombined } from "react-icons/fa";
import { fetchRooms } from "../redux/slices/roomsSlice";
import "./Rooms.css";

const Rooms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms, loading, error } = useSelector((state) => state.rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.selectedRoomId && rooms.length > 0) {
      const roomFromState = rooms.find(
        (r) => r._id === location.state.selectedRoomId
      );
      if (roomFromState) {
        setSelectedRoom(roomFromState);
        setShowModal(true);
      }
    }
  }, [location.state, rooms]);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    navigate(location.pathname, { replace: true });
  };

  const handleBookFromModal = () => {
    if (selectedRoom) {
      navigate("/booking", {
        state: {
          selectedRoom: selectedRoom,
          roomId: selectedRoom._id,
          roomType: selectedRoom.type,
          roomPrice: selectedRoom.price,
          roomNumber: selectedRoom.roomNumber,
          roomName: selectedRoom.roomName,
        },
      });
      setShowModal(false);
    }
  };

  const amenityLabels = {
    WiFi: "Free WiFi",
    TV: "Smart TV",
    AC: "Air Conditioning",
    "Mini Bar": "Mini Bar",
    Pool: "Swimming Pool",
    Parking: "Free Parking",
    Gym: "Fitness Center",
    Shower: "Private Bathroom",
    "Room Service": "Room Service",
    Accessible: "Accessible",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const getRoomImageUrl = (img) => {
    if (!img) return "/default-room.jpg";
    if (img.startsWith("http")) return img;
    return `${backendUrl}/uploads/${img}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="page-hero" style={{
        backgroundImage: "url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg)"
      }}>
        <div className="container">
          <div className="row h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-10">
              <motion.h1 className="display-3 text-white mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>
                Our Rooms
              </motion.h1>
              <motion.nav aria-label="breadcrumb"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}>
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-white">Home</a>
                  </li>
                  <li className="breadcrumb-item active text-secondary" aria-current="page">Rooms</li>
                </ol>
              </motion.nav>
            </div>
          </div>
        </div>
      </section>

      <div className="rooms-container">
        <motion.div className="rooms-header"
          variants={headerVariants}
          initial="hidden"
          animate="visible">
          <h1>Our Accommodations</h1>
          <p>
            Explore our selection of meticulously designed rooms, each offering a unique blend of comfort and luxury.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}

        {!loading && !error && Array.isArray(rooms) && rooms.length > 0 && (
          <motion.div className="rooms-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            {rooms.map((room) => (
              <motion.div key={room._id}
                className="room-card"
                variants={cardVariants}
                onClick={() => handleViewDetails(room)}
                layoutId={`room-card-${room._id}`}>
                <motion.img
                  src={getRoomImageUrl(room.image)}
                  className="bg-image"
                  alt={room.type || "Room"}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-room.jpg";
                  }}
                />
                <div className="overlay"></div>
                <div className="room-price">${room.price || 0} / night</div>
                <div className="room-info">
                  <h3>{room.roomName || room.type || "Unnamed Room"}</h3>
                  <p className="description">{room.description || "No description available."}</p>
                  <div className="room-details">
                    <div className="room-detail"><FaRulerCombined /><span>{room.size || 0} m²</span></div>
                    <div className="room-detail"><FaUsers /><span>{room.capacity || 0} Guests</span></div>
                    <div className="room-detail"><FaBed /><span>{room.beds || 1} Bed(s)</span></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && (!Array.isArray(rooms) || rooms.length === 0) && (
          <div className="text-center py-5">
            <p>No rooms available at the moment.</p>
          </div>
        )}

        <AnimatePresence>
          {showModal && selectedRoom && (
            <motion.div className="modal show d-block" tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleCloseModal}>
              <motion.div className="modal-dialog modal-lg"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedRoom.roomName || selectedRoom.type || "Unnamed Room"}</h5>
                    <motion.button type="button" className="btn-close" onClick={handleCloseModal}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}></motion.button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-lg-6">
                        <img
                          src={getRoomImageUrl(selectedRoom.image)}
                          alt={selectedRoom.type}
                          className="img-fluid rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-room.jpg";
                          }}
                        />
                      </div>
                      <div className="col-lg-6">
                        <h3>{selectedRoom.roomName || selectedRoom.type || "Unnamed Room"}</h3>
                        <p className="lead">${selectedRoom.price || 0} per night</p>
                        <p>{selectedRoom.description || "No description available."}</p>
                        <div className="d-flex justify-content-around my-4">
                          <div className="text-center"><FaRulerCombined className="h4 text-primary" /><p>{selectedRoom.size || 0} m²</p></div>
                          <div className="text-center"><FaUsers className="h4 text-primary" /><p>{selectedRoom.capacity || 0} Guests</p></div>
                          <div className="text-center"><FaBed className="h4 text-primary" /><p>{selectedRoom.beds || 1} Bed(s)</p></div>
                        </div>
                        <h5>Amenities</h5>
                        <ul>
                          {Array.isArray(selectedRoom.amenities) &&
                            selectedRoom.amenities.map((amenity) => (
                              <li key={amenity}>{amenityLabels[amenity] || amenity}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleBookFromModal}>Book This Room</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Rooms;
