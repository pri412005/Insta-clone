import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "../src/routes/auth.routes.js";
import otpRoutes from "../src/routes/otp.routes.js";
import postRoutes from "../src/routes/post.routes.js";
import followRoutes from "../src/routes/follow.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import notificationRoutes from "./routes/notication.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import storyRoutes from "./routes/story.routes.js"
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/post", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/notifications",notificationRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/story", storyRoutes);
app.use(errorHandler);
export default app;

