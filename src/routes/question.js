import express from "express";
import { summarizeQuestion } from "../utility/gemini.js";
import Question from "../models/Question.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userid, title, description, tag } = req.body;

    // Use Gemini AI to auto-summarize question
    const aiContent = await summarizeQuestion(title, description);
    const [summarizedTitle, summarizedDescription] = aiContent.split("\n");

    const newQuestion = await Question.create({
      userid,
      title: summarizedTitle || title,
      description: summarizedDescription || description,
      tag,
    });

    res
      .status(201)
      .json({
        message: "Question created successfully",
        question: newQuestion,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create question" });
  }
});

export default router;
