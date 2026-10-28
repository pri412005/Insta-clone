import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";
import {
    getAIStorySuggestion,
    saveStoryFromSuggestion,
    saveCustomStory
} from "../controller/story.controller.js";

const storyRoutes = express.Router();

// Image upload + AI se suggestion mangwana
storyRoutes.post(
    "/ai-suggestion",
    identifyUser,
    upload.single("image"),
    getAIStorySuggestion
);

// Done click - AI suggestion ko final story bana ke save karna
storyRoutes.post(
    "/save-ai-story",
    identifyUser,
    saveStoryFromSuggestion
);

// Custom story save (manual)
storyRoutes.post(
    "/save-custom-story",
    identifyUser,
    upload.single("image"),
    saveCustomStory
);

export default storyRoutes;