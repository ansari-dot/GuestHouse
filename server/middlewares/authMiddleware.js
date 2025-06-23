import jwt from 'jsonwebtoken';

export const auth = async(req, res, next) => {
    try {
        const token = req.cookies.token; // Get token from cookie

        if (!token) {
            return res.status(401).json({ message: "Please login first" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY || "sardar123");
        req.user = { id: decoded.id }; // Ensure user.id is available
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: "Invalid token" });
    }
};