import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaEye, FaTrash } from "react-icons/fa"
import { fetchMessages, deleteMessage, markMessageAsRead } from "../redux/slices/messagesSlice"

const AdminMessage = () => {
    const dispatch = useDispatch()
    const { messages } = useSelector((state) => state.messages)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [messageFilter, setMessageFilter] = useState('all')

    useEffect(() => {
        dispatch(fetchMessages())
    }, [dispatch])

    const handleViewMessage = async (message) => {
        setSelectedMessage(message)
        if (!message.read) {
            try {
                await dispatch(markMessageAsRead(message._id))
                dispatch(fetchMessages())
            } catch (error) {
                console.error('Error marking message as read:', error)
            }
        }
    }

    const handleDeleteMessage = async (messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await dispatch(deleteMessage(messageId))
                dispatch(fetchMessages())
                setSelectedMessage(null)
            } catch (error) {
                console.error('Error deleting message:', error)
            }
        }
    }

    const filteredMessages = messages.filter(message => 
        messageFilter === 'all' || 
        (messageFilter === 'unread' && !message.read) ||
        (messageFilter === 'read' && message.read)
    )

    return (
        <div className="messages-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">Manage Messages</h2>
                <div className="d-flex gap-2">
                    <select 
                        className="form-select" 
                        onChange={(e) => setMessageFilter(e.target.value)}
                    >
                        <option value="all">All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>From</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMessages.map((message) => (
                            <tr key={message._id} className={!message.read ? 'table-primary' : ''}>
                                <td>{message.name}</td>
                                <td>{message.subject}</td>
                                <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge bg-${message.read ? 'success' : 'warning'}`}>
                                        {message.read ? 'Read' : 'Unread'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleViewMessage(message)}
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteMessage(message._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedMessage && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedMessage.subject}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedMessage(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>From:</strong> {selectedMessage.name}</p>
                                <p><strong>Email:</strong> {selectedMessage.email}</p>
                                <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                <p><strong>Message:</strong></p>
                                <p>{selectedMessage.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {selectedMessage && (
                <div className="modal-backdrop show"></div>
            )}
        </div>
    )
}

export default AdminMessage 