 import mongoose from 'mongoose';

 const roomSchema = new mongoose.Schema({
     roomName: {
         type: String,
         required: true
     },
     roomNumber: {
         type: Number,
         required: true,
         unique: true, // Prevent duplicate room numbers
     },
     type: {
         type: String,
         required: true,
         trim: true,
         enum: ['Standard', 'Deluxe', 'Suite'], // Restrict to valid types
     },
     description: {
         type: String,
         required: true,
         trim: true,
     },
     price: {
         type: Number,
         required: true,
         min: 0,
     },
     size: {
         type: Number,
         required: true,
         min: 0,
     },
     capacity: {
         type: Number,
         required: true,
         min: 1,
     },
     image: {
         type: String,
         required: false, // Allow no image upload
     },
     amenities: [{
         type: String,
     }], // Allow empty array
     available: {
         type: Boolean,
         default: true,
     },
 }, {
     timestamps: true,
 });

 const Rooms = mongoose.model('Rooms', roomSchema);

 export default Rooms;