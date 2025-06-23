import Feedback from "../models/FeedBack.js";
import User from '../models/User.js'
// to add the feedback form
export const addFeedback = async(req, res) => {
        const { name, email, subject, message } = req.body;
        // const userId = req.user;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false
            });
        }
        try {
            /*   const user = await User.findById(userId);
               if (!user) {
                   return res.status(404).json({ msg: "you cannot give feedback" });
               } */
            const newFeedback = await Feedback.create({
                name,
                email,
                subject,
                message,
            })
            await newFeedback.save();
            res.json({
                message: "Feedback added successfully",
                success: true
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                message: "Server error",
                success: false
            });

        }
    }
    // to delete the feedback form

export const deleteFeedback = async(req, res) => {
    const feedbackId = req.params.id;
    const userId = req.user;

    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            res.status(400).json({
                message: "You are not authorized to delete the feedback",
                success: false
            })

            await Feedback.findByIdAndDelete(feedbackId);
            res.status(200).json({
                message: "FeedBack delete SuccessFully",
                success: true,
            })
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({
            message: "Server Error",
        })
    }
}

// to get feedback to admin  

export const getFeedback = async(req, res) => {
    const userId = req.user;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(400).json({
                message: "You are not authorized to view the feedback",
                success: false
            })
        }
        const feedback = await User.findOne();
        res.status(200).json({
            message: "Feedbacks",
            success: true,
            feedback
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Server Error",
            success: false
        })
    }

}