"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import AdminSidebar from "../components/AdminSidebar"
import RoomModal from "../components/RoomModal"
import { fetchRooms, deleteRoom } from "../redux/slices/roomsSlice"
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from "react-icons/fa"

const AdminRooms = () => {
  const dispatch = useDispatch()
  const { rooms, loading, error, success } = useSelector((state) => state.rooms)
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filteredRooms, setFilteredRooms] = useState([])

  useEffect(() => {
    dispatch(fetchRooms())
  }, [dispatch])

  useEffect(() => {
    let filtered = rooms

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType) {
      filtered = filtered.filter((room) => room.type === filterType)
    }

    setFilteredRooms(filtered)
  }, [rooms, searchTerm, filterType])

  const handleAddRoom = () => {
    setSelectedRoom(null)
    setShowModal(true)
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  const handleDeleteRoom = (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(roomId))
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedRoom(null)
  }

  const roomTypes = [...new Set(rooms.map((room) => room.type))]

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Rooms</h2>
          <button className="btn btn-primary" onClick={handleAddRoom}>
            <FaPlus className="me-2" />
            Add New Room
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room Name</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td>{room.name}</td>
                      <td>${room.price}</td>
                      <td>
                        <span
                          className={`badge ${
                            room.available ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {room.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditRoom(room)}
                          title="Edit Room"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteRoom(room.id)}
                          title="Delete Room"
                        >
                          <FaTrash />
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

      {/* Room Modal */}
      <RoomModal show={showModal} onHide={handleCloseModal} room={selectedRoom} />
    </div>
  )
}

export default AdminRooms
