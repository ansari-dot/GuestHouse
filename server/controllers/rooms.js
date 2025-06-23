import Room from '../models/Rooms.js';
import User from '../models/User.js';

// Get next available room number
export const getNextRoomNumber = async(req, res) => {
    try {
        const highestRoom = await Room.findOne().sort({ roomNumber: -1 });
        const nextRoomNumber = highestRoom ? highestRoom.roomNumber + 1 : 1;
        
        res.status(200).json({
            nextRoomNumber
        });
    } catch (error) {
        console.error("Error getting next room number:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// Add rooms by admin
export const addRooms = async(req, res) => {
    const { roomNumber, type, description, price, size, capacity, amenities } = req.body;
    const userId = req.user.id; // Extract user ID from JWT payload

    // Validate required fields
    if (!roomNumber || !type || !description || !price || !size || !capacity) {
        return res.status(400).json({
            message: "Please fill all required fields",
        });
    }

    try {
        // Check if user is authorized
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({
                message: "You are not authorized to add rooms",
            });
        }

        // Check if room number already exists
        const existingRoom = await Room.findOne({ roomNumber: Number(roomNumber) });
        if (existingRoom) {
            return res.status(400).json({
                message: `Room number ${roomNumber} already exists. Please choose a different room number.`,
            });
        }

        // Parse amenities (sent as JSON string from frontend)
        let parsedAmenities = [];
        if (amenities) {
            try {
                parsedAmenities = JSON.parse(amenities);
                if (!Array.isArray(parsedAmenities)) {
                    return res.status(400).json({
                        message: "Amenities must be an array",
                    });
                }
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid amenities format",
                });
            }
        }

        // Handle single image upload
        const imagePath = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

        const newRoom = new Room({
            roomNumber: Number(roomNumber),
            type,
            description,
            price: Number(price),
            size: Number(size),
            capacity: Number(capacity),
            amenities: parsedAmenities,
            image: imagePath,
        });

        await newRoom.save();

        res.status(201).json({
            message: "Room added successfully",
            room: newRoom,
        });
    } catch (error) {
        console.error("Error adding room:", error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Room number ${roomNumber} already exists. Please choose a different room number.`,
            });
        }
        
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// Get all rooms
export const getRooms = async(req, res) => {
    try {
        const rooms = await Room.find().sort({ roomNumber: 1 }); // Sort by room number
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({
                message: "No rooms found",
            });
        }
        
        // Ensure all rooms have proper image URLs
        const roomsWithImages = rooms.map(room => {
            const roomObj = room.toObject();
            if (roomObj.image && !roomObj.image.startsWith('http')) {
                roomObj.image = `http://localhost:3000${roomObj.image}`;
            }
            return roomObj;
        });
        
        res.status(200).json(roomsWithImages);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// Update a room by ID
export const updateRoom = async(req, res) => {
    const { roomNumber, type, description, price, size, capacity, amenities } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    // Validate required fields
    if (!roomNumber || !type || !description || !price || !size || !capacity) {
        return res.status(400).json({
            message: "Please fill all required fields",
        });
    }

    try {
        // Check if user is authorized
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({
                message: "You are not authorized to update rooms",
            });
        }

        // Check if room number already exists (excluding current room)
        const existingRoom = await Room.findOne({ 
            roomNumber: Number(roomNumber),
            _id: { $ne: id } // Exclude current room from check
        });
        if (existingRoom) {
            return res.status(400).json({
                message: `Room number ${roomNumber} already exists. Please choose a different room number.`,
            });
        }

        // Parse amenities
        let parsedAmenities = [];
        if (amenities) {
            try {
                parsedAmenities = JSON.parse(amenities);
                if (!Array.isArray(parsedAmenities)) {
                    return res.status(400).json({
                        message: "Amenities must be an array",
                    });
                }
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid amenities format",
                });
            }
        }

        // Handle single image upload
        const imagePath = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : undefined;

        // Prepare update object
        const updateData = {
            roomNumber: Number(roomNumber),
            type,
            description,
            price: Number(price),
            size: Number(size),
            capacity: Number(capacity),
            amenities: parsedAmenities,
            ...(imagePath && { image: imagePath }),
        };

        const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedRoom) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        // Ensure proper image URL
        const roomObj = updatedRoom.toObject();
        if (roomObj.image && !roomObj.image.startsWith('http')) {
            roomObj.image = `http://localhost:3000${roomObj.image}`;
        }

        res.status(200).json({
            message: "Room updated successfully",
            room: roomObj,
        });
    } catch (error) {
        console.error("Error updating room:", error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: `Room number ${roomNumber} already exists. Please choose a different room number.`,
            });
        }
        
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// Delete a room by ID
export const deleteRoom = async(req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Check if user is authorized
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({
                message: "You are not authorized to delete rooms",
            });
        }

        const deletedRoom = await Room.findByIdAndDelete(id);

        if (!deletedRoom) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        res.status(200).json({
            message: "Room deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

// Filter rooms
export const filterRooms = async(req, res) => {
    try {
        const { type, minPrice, maxPrice, capacity } = req.query;
        let filter = {};

        if (type) filter.type = type;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (capacity) filter.capacity = { $gte: Number(capacity) };

        const rooms = await Room.find(filter).sort({ roomNumber: 1 });
        
        // Ensure all rooms have proper image URLs
        const roomsWithImages = rooms.map(room => {
            const roomObj = room.toObject();
            if (roomObj.image && !roomObj.image.startsWith('http')) {
                roomObj.image = `http://localhost:3000${roomObj.image}`;
            }
            return roomObj;
        });

        res.status(200).json(roomsWithImages);
    } catch (error) {
        console.error("Error filtering rooms:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};