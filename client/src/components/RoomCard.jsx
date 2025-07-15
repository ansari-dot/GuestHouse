import React from 'react';
import { motion } from 'framer-motion';
import { FaBed, FaUsers, FaRulerCombined } from 'react-icons/fa';
import './RoomCard.css';

const RoomCard = ({ room, onClick }) => {
  const { _id, type, description, price, capacity, size, beds, image } = room;
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ✅ Clean image URL logic
  const imageUrl = image
    ? (image.startsWith('http') ? image : `${backendUrl}/uploads/${image}`)
    : "/default-room.jpg";

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      key={_id}
      className="room-card"
      variants={cardVariants}
      onClick={() => onClick(room)}
      layoutId={`room-card-${_id}`}
    >
      <motion.img
        src={imageUrl}
        className="bg-image"
        alt={type || "Room"}
        loading="lazy" // ✅ prevents browser from loading all images at once
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-room.jpg"; // fallback to local cached image
        }}
      />
      <div className="overlay"></div>

      <div className="room-price">${price || 0} / night</div>

      <div className="room-info">
        <h3>{type || "Unnamed Room"}</h3>
        <p className="description">{description || "No description available."}</p>

        <div className="room-details">
          <div className="room-detail">
            <FaRulerCombined />
            <span>{size || 0} m²</span>
          </div>
          <div className="room-detail">
            <FaUsers />
            <span>{capacity || 0} Guests</span>
          </div>
          <div className="room-detail">
            <FaBed />
            <span>{beds || 1} Bed(s)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
