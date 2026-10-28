import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";
import {
    getAIStorySuggestion,
    saveStoryFromSuggestion,
    saveCustomStory
} from "../controller/story.controller.js";

const storyRoutes = express.Router();

storyRoutes.post(
    "/ai-suggestion",
    identifyUser,
    upload.single("image"),
    getAIStorySuggestion
);

storyRoutes.post(
    "/save-ai-story",
    identifyUser,
    saveStoryFromSuggestion
);

storyRoutes.post(
    "/save-custom-story",
    identifyUser,
    upload.single("image"),
    saveCustomStory
);

export default storyRoutes;