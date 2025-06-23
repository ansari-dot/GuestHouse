"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import AdminSidebar from "../components/AdminSidebar"
import { fetchMessages, markMessageAsRead } from "../redux/slices/messagesSlice"
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTrash, FaSearch } from "react-icons/fa"

const AdminMessages = () => {
  const dispatch = useDispatch()
  const { messages, loading } = useSelector((state) => state.messages)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filteredMessages, setFilteredMessages] = useState([])

  useEffect(() => {
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus === "read") {
      filtered = filtered.filter((message) => message.read)
    } else if (filterStatus === "unread") {
      filtered = filtered.filter((message) => !message.read)
    }

    setFilteredMessages(filtered)
  }, [messages, searchTerm, filterStatus])

  const handleMessageClick = (message) => {
    setSelectedMessage(message)
    if (!message.read) {
      dispatch(markMessageAsRead(message.id))
    }
  }

  const handleReply = (message) => {
    // Open email client or reply modal
    window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">Messages</h2>
        <div className="card">
          <div className="card-body">
            <div className="list-group">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`list-group-item list-group-item-action ${
                    !msg.read ? "" : ""
                  }`}
                >
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {msg.read ? (
                        <FaEnvelopeOpen className="text-muted me-3" />
                      ) : (
                        <FaEnvelope className="text-primary me-3" />
                      )}
                      <div>
                        <h6 className="mb-1">{msg.subject}</h6>
                        <small className="text-muted">
                          From: {msg.name} ({msg.email})
                        </small>
                      </div>
                  </div>
                    <small className="text-muted">{msg.date}</small>
                  </div>
                  <p className="mb-1 mt-2">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMessages
