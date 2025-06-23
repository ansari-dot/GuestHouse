import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    /* User: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
     }, */
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const FeedBack = mongoose.model('FeedBack', feedbackSchema);
export default FeedBack;