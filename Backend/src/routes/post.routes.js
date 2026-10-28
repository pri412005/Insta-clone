import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import multer from "multer";
import { createPost, getUserPosts, getPostDetailsController, getFeed, deletePost, toggleLikePost, toggleSavePost, getExploreFeed } from "../controller/post.controller.js";

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files allowed"));
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
const postRoutes = express.Router();

postRoutes.post("/", identifyUser, upload.array("images"), createPost)
postRoutes.delete("/delete/:postId", identifyUser, deletePost)
postRoutes.get("/", identifyUser, getUserPosts)
postRoutes.get("/details/:postid", identifyUser, getPostDetailsController)
postRoutes.post("/like/:postid", identifyUser, toggleLikePost)
postRoutes.get("/feed", identifyUser, getFeed)
postRoutes.post("/:postId/save", identifyUser, toggleSavePost);
postRoutes.get("/explore", identifyUser, getExploreFeed);


export default postRoutes