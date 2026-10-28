import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const identifyUser = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.token;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({ message: err.message });
    }
});

export default identifyUser;