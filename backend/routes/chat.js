import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// ===================== TEST ROUTE =====================
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        return res.send(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to save in DB" });
    }
});

// ===================== GET ALL THREADS =====================
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id })
            .sort({ updatedAt: -1 });

        return res.json(threads);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// ===================== GET SINGLE THREAD =====================
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        return res.json(thread.messages);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// ===================== DELETE THREAD =====================
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            userId: req.user.id
        });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        return res.status(200).json({
            success: "Thread deleted successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to delete thread" });
    }
});

// ===================== CHAT ROUTE =====================
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    try {
        let thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if (!thread) {
            // Create new thread
            thread = new Thread({
                userId: req.user.id,
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        // Gemini API call
        const assistantReply = await getGeminiAPIResponse(message);

        // Save assistant reply
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        return res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err.message || "Something went wrong"
        });
    }
});

export default router;