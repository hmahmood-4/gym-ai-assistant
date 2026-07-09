require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are an elite personal trainer and sports nutritionist AI. When a user asks about a workout day, respond ONLY in this exact JSON format with no extra text, no markdown, no code blocks, just raw JSON:

{
  "title": "CHEST DAY POWER SESSION",
  "tagline": "Build the chest of a champion",
  "workouts": [
    {
      "name": "Barbell Bench Press",
      "sets": 4,
      "reps": "8-10",
      "rest": "90 sec",
      "tip": "Keep shoulder blades retracted and feet flat on floor"
    }
  ],
  "meal_plan": {
    "pre_workout": "Oats with banana and peanut butter 1 hour before",
    "post_workout": "Whey protein shake with milk within 30 minutes",
    "breakfast": "6 egg whites, 2 whole eggs, brown toast, avocado",
    "lunch": "Grilled chicken breast, brown rice, steamed broccoli",
    "dinner": "Salmon fillet, sweet potato, mixed green salad",
    "snacks": "Greek yogurt with almonds, or cottage cheese with fruit"
  },
  "water_intake": {
    "daily_liters": 3.5,
    "note": "Drink 500ml on waking, 400ml pre-workout, 200ml every 30min during training, 500ml post-workout"
  },
  "should_do": [
    "Warm up for 10 minutes before lifting",
    "Focus on mind-muscle connection",
    "Keep a training log",
    "Sleep 7-9 hours for recovery",
    "Stretch after every session"
  ],
  "should_not_do": [
    "Do not skip warm up sets",
    "Do not hold your breath while lifting",
    "Do not train to failure every set",
    "Do not skip rest days",
    "Do not eat junk food after training"
  ],
  "motivational_message": "Today you are one rep closer to the champion you are becoming."
}

STRICT RULES:
- Always include 8 or more exercises in workouts array
- Each workout must have name, sets, reps, rest, tip
- should_do and should_not_do must have at least 5 items each
- Return ONLY raw JSON - no markdown, no backticks, no explanation`;

app.post("/api/workout", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Missing query." });
  }

  try {
    console.log("Calling Groq API for:", query);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query.trim() },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    console.log("Groq response status:", response.status);

    if (!response.ok) {
      console.error("Groq error:", JSON.stringify(data));
      return res.status(500).json({ error: data.error?.message || "Groq API error" });
    }

    const rawText = data.choices?.[0]?.message?.content || "";
    console.log("Raw text preview:", rawText.substring(0, 120));

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    console.log("Success! Sending workout plan.");
    return res.json({ success: true, data: parsed });

  } catch (err) {
    console.error("ERROR:", err.message);
    return res.status(500).json({ error: err.message || "Failed to generate workout plan." });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Gym AI backend running with Groq 💪" });
});

app.listen(PORT, () => {
  console.log(`\n💪 Gym AI Backend (Groq) running at http://localhost:${PORT}\n`);
});