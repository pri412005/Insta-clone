import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js"

// STEP 1: AI se suggestion mangwana
export const getAIStorySuggestion = asyncHandler(async (req, res, next) => {
    const { prompt } = req.body;
    const imageUrl = req.file?.path; // agar multer/imagekit middleware se image upload hui

    if (!imageUrl) {
        return next(new AppError("Image is required", 400));
    }
    if (!prompt) {
        return next(new AppError("Prompt is required", 400));
    }

    // Claude API ko call karna - image + prompt bhejna
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 500,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: { type: "url", url: imageUrl }
                        },
                        {
                            type: "text",
                            text: `Tum ek social media story designer ho. Is image ko dekho aur user ke prompt "${prompt}" ke basis pe ek story suggestion do. Sirf JSON format mein reply karo, koi extra text nahi. Format:
                            {
                              "textOverlay": { "content": "string", "position": {"x": number, "y": number}, "color": "hex code" },
                              "emojis": [{"emoji": "string", "position": {"x": number, "y": number}}],
                              "moodTags": ["string"]
                            }`
                        }
                    ]
                }
            ]
        })
    });

    const data = await aiResponse.json();

    // AI ka reply text nikal ke JSON mein parse karna
    let suggestion;
    try {
        const rawText = data.content[0].text.replace(/```json|```/g, "").trim();
        suggestion = JSON.parse(rawText);
    } catch (err) {
        return next(new AppError("AI response could not be processed", 500));
    }

    // Mood tags ke basis pe music dhoondna
    const matchedMusic = await Music.findOne({
        moodTags: { $in: suggestion.moodTags }
    });

    res.status(200).json({
        success: true,
        data: {
            imageUrl,
            textOverlay: suggestion.textOverlay,
            emojis: suggestion.emojis,
            music: matchedMusic ? {
                musicId: matchedMusic._id,
                title: matchedMusic.title,
                audioUrl: matchedMusic.audioUrl
            } : null
        }
    });
});

// STEP 2: "Done" click pe - suggestion ko final story banake save karna
export const saveStoryFromSuggestion = asyncHandler(async (req, res, next) => {
    const { imageUrl, textOverlay, emojis, music } = req.body;
    const userId = req.user._id; // identifyUser middleware se aayega

    if (!imageUrl) {
        return next(new AppError("Image is required", 400));
    }

    const newStory = await Story.create({
        user: userId,
        imageUrl,
        textOverlay,
        emojis,
        music,
        isAIGenerated: true
    });

    res.status(201).json({
        success: true,
        message: "Story posted successfully",
        data: newStory
    });
});

// Custom story ke liye alag route - manual save (isAIGenerated: false)
export const saveCustomStory = asyncHandler(async (req, res, next) => {
    const { imageUrl, textOverlay, emojis, music } = req.body;
    const userId = req.user._id;

    if (!imageUrl) {
        return next(new AppError("Image is required", 400));
    }

    const newStory = await Story.create({
        user: userId,
        imageUrl,
        textOverlay,
        emojis,
        music,
        isAIGenerated: false
    });

    res.status(201).json({
        success: true,
        message: "Custom story posted successfully",
        data: newStory
    });
});