import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Admin = async(req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied: Not an admin",
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// controllers/auth.js

export const checkAuthStatus = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Auth check error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// admin  login function
export const AdminLogin = async(req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        // Check if user is admin
        if (existingUser.role !== "admin") {
            return res.status(400).json({
                message: "You are not authorized as admin"
            });
        }

        const SECRET_KEY = process.env.SECRET_KEY || "sardar123";
        const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 3600000,
            path: "/"
        });

        return res.status(200).json({
            message: "✅ Admin login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role
            },
            token: token
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error in admin login" });
    }
};