import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaCoffee,
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaDoorOpen,
  FaFire,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axios";
import "./AdminRoom.css";

const AdminRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    roomName: "",
    roomNumber: "",
    type: "",
    price: "",
    capacity: "",
    size: "",
    amenities: [],
    description: "",
    image: null,
  });

  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Available amenities with icons
  const availableAmenities = [
    { id: "WiFi", label: "WiFi", icon: <FaWifi /> },
    { id: "TV", label: "TV", icon: <FaTv /> },
    { id: "AC", label: "Air Conditioning", icon: <FaSnowflake /> },
    { id: "Coffee", label: "Coffee Maker", icon: <FaCoffee /> },
    { id: "Pool", label: "Swimming Pool Access", icon: <FaSwimmingPool /> },
    { id: "Parking", label: "Free Parking", icon: <FaParking /> },
    { id: "Breakfast", label: "Breakfast Included", icon: <FaUtensils /> },
    { id: "Balcony", label: "Private Balcony", icon: <FaDoorOpen /> },
    { id: "BBQ", label: "Barbeque Area", icon: <FaFire /> },
    { id: "Photoshoot", label: "Photoshoot Area", icon: <FaCamera /> },
    { id: "Bonfire", label: "Bonfire Area", icon: <FaFire /> },
  ];

  // Fetch rooms from the backend
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/getRooms");
      setRooms(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Get next available room number
  const getNextRoomNumber = async () => {
    try {
      const response = await axiosInstance.get("/nextRoomNumber");
      return response.data.nextRoomNumber;
    } catch (err) {
      console.error("Error getting next room number:", err);
      return 1; // Fallback to 1
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle amenities change
  const handleAmenitiesChange = (amenityId) => {
    setFormData((prev) => {
      const currentAmenities = [...prev.amenities];
      const index = currentAmenities.indexOf(amenityId);

      if (index === -1) {
        currentAmenities.push(amenityId);
      } else {
        currentAmenities.splice(index, 1);
      }

      return {
        ...prev,
        amenities: currentAmenities,
      };
    });
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.roomName.trim()) {
      errors.roomName = "Room name is required";
    }

    // Room Number validation (must be a number)
    if (!formData.roomNumber || isNaN(formData.roomNumber)) {
      errors.roomNumber = "Room number must be a number";
    }

    // Price validation (must be a positive number)
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      errors.price = "Price must be a positive number";
    }

    // Capacity validation (must be a positive number)
    if (
      !formData.capacity ||
      isNaN(formData.capacity) ||
      Number(formData.capacity) <= 0
    ) {
      errors.capacity = "Capacity must be a positive number";
    }

    // Size validation (must be a positive number)
    if (!formData.size || isNaN(formData.size) || Number(formData.size) <= 0) {
      errors.size = "Size must be a positive number";
    }

    // Type validation
    if (!formData.type) {
      errors.type = "Room type is required";
    }

    // Amenities validation
    if (formData.amenities.length === 0) {
      errors.amenities = "Please select at least one amenity";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    if (["roomNumber", "price", "capacity", "size"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axiosInstance.post("/addRooms", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Room added successfully!");
      setShowAddModal(false);
      setFormData({
        roomName: "",
        roomNumber: "",
        type: "",
        price: "",
        capacity: "",
        size: "",
        amenities: [],
        description: "",
        image: null,
      });
      setImagePreview(null);
      setFormErrors({});
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add room");
      console.error("Error adding room:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "amenities") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axiosInstance.put(`/rooms/${selectedRoom._id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Room updated successfully!");
      setShowEditModal(false);
      setSelectedRoom(null);
      setFormData({
        roomName: "",
        roomNumber: "",
        type: "",
        price: "",
        capacity: "",
        size: "",
        amenities: [],
        description: "",
        image: null,
      });
      setImagePreview(null);
      setFormErrors({});
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update room");
      console.error("Error updating room:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/deleteRoom/${roomId}`);
        toast.success("Room deleted successfully!");
        fetchRooms();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete room");
        console.error("Error deleting room:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomName: room.roomName || "",
      roomNumber: room.roomNumber || "",
      type: room.type || "",
      price: room.price || "",
      capacity: room.capacity || "",
      size: room.size || "",
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      description: room.description || "",
      image: null,
    });
    setImagePreview(room.image || null);
    setFormErrors({});
    setShowEditModal(true);
  };

  // Open add modal with next room number
  const openAddModal = async () => {
    const nextRoomNumber = await getNextRoomNumber();
    setFormData({
      roomName: "",
      roomNumber: nextRoomNumber,
      type: "",
      price: "",
      capacity: "",
      size: "",
      amenities: [],
      description: "",
      image: null,
    });
    setImagePreview(null);
    setFormErrors({});
    setShowAddModal(true);
  };

  const getRoomImageUrl = (img) => {
    if (!img) return "/default-room.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads/")) return `${backendUrl}${img}`;
    return `${backendUrl}/uploads/${img}`;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Rooms</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus className="me-2" /> Add New Room
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Room Name</th>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rooms) && rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room._id}>
                    <td>
                      {room.image ? (
                        <img
                          src={getRoomImageUrl(room.image)}
                          alt={`Room ${room.roomNumber}`}
                          className="room-thumbnail"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-room.jpg";
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>{room.roomName}</td>
                    <td>{room.roomNumber}</td>
                    <td>{room.type}</td>
                    <td>${room.price}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => openEditModal(room)}>
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteRoom(room._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Room Modal */}
      <div
        className={`modal fade ${showAddModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Room</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddModal(false)}></button>
            </div>
            <form onSubmit={handleAddRoom}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Room Name *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.roomName ? "is-invalid" : ""
                        }`}
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.roomName && (
                        <div className="invalid-feedback">
                          {formErrors.roomName}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Room Number *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.roomNumber ? "is-invalid" : ""
                        }`}
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.roomNumber && (
                        <div className="invalid-feedback">
                          {formErrors.roomNumber}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Room Type *</label>
                      <select
                        className={`form-select ${
                          formErrors.type ? "is-invalid" : ""
                        }`}
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required>
                        <option value="">Select Type</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                      </select>
                      {formErrors.type && (
                        <div className="invalid-feedback">
                          {formErrors.type}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Price per Night *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.price ? "is-invalid" : ""
                        }`}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                      {formErrors.price && (
                        <div className="invalid-feedback">
                          {formErrors.price}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Capacity *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.capacity ? "is-invalid" : ""
                        }`}
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                      {formErrors.capacity && (
                        <div className="invalid-feedback">
                          {formErrors.capacity}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Size (sq ft) *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.size ? "is-invalid" : ""
                        }`}
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                      {formErrors.size && (
                        <div className="invalid-feedback">
                          {formErrors.size}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Room Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className={`form-control ${
                          formErrors.description ? "is-invalid" : ""
                        }`}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required></textarea>
                      {formErrors.description && (
                        <div className="invalid-feedback">
                          {formErrors.description}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Amenities *</label>
                      <div className="amenities-grid">
                        {availableAmenities.map((amenity) => (
                          <div key={amenity.id} className="amenity-item">
                            <input
                              type="checkbox"
                              id={amenity.id}
                              checked={formData.amenities.includes(amenity.id)}
                              onChange={() => handleAmenitiesChange(amenity.id)}
                            />
                            <label htmlFor={amenity.id}>
                              {amenity.icon} {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.amenities && (
                        <div className="text-danger small">
                          {formErrors.amenities}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}>
                  {loading ? "Adding..." : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Room Modal */}
      <div
        className={`modal fade ${showEditModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Room</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEditModal(false)}></button>
            </div>
            <form onSubmit={handleEditRoom}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Room Name *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.roomName ? "is-invalid" : ""
                        }`}
                        name="roomName"
                        value={formData.roomName}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.roomName && (
                        <div className="invalid-feedback">
                          {formErrors.roomName}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Room Number *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.roomNumber ? "is-invalid" : ""
                        }`}
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.roomNumber && (
                        <div className="invalid-feedback">
                          {formErrors.roomNumber}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Room Type *</label>
                      <select
                        className={`form-select ${
                          formErrors.type ? "is-invalid" : ""
                        }`}
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required>
                        <option value="">Select Type</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                      </select>
                      {formErrors.type && (
                        <div className="invalid-feedback">
                          {formErrors.type}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Price per Night *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.price ? "is-invalid" : ""
                        }`}
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                      {formErrors.price && (
                        <div className="invalid-feedback">
                          {formErrors.price}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Capacity *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.capacity ? "is-invalid" : ""
                        }`}
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                      {formErrors.capacity && (
                        <div className="invalid-feedback">
                          {formErrors.capacity}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Size (sq ft) *</label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.size ? "is-invalid" : ""
                        }`}
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                      {formErrors.size && (
                        <div className="invalid-feedback">
                          {formErrors.size}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Room Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className={`form-control ${
                          formErrors.description ? "is-invalid" : ""
                        }`}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required></textarea>
                      {formErrors.description && (
                        <div className="invalid-feedback">
                          {formErrors.description}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Amenities *</label>
                      <div className="amenities-grid">
                        {availableAmenities.map((amenity) => (
                          <div key={amenity.id} className="amenity-item">
                            <input
                              type="checkbox"
                              id={amenity.id}
                              checked={formData.amenities.includes(amenity.id)}
                              onChange={() => handleAmenitiesChange(amenity.id)}
                            />
                            <label htmlFor={amenity.id}>
                              {amenity.icon} {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.amenities && (
                        <div className="text-danger small">
                          {formErrors.amenities}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}>
                  {loading ? "Updating..." : "Update Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoom;
