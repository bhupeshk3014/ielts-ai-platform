import dotenv from "dotenv";
dotenv.config();

// Hugging Face: Zephyr-7B-Beta Model for IELTS Study Plan Generation
export const generateStudyPlan = async (req, res) => {
  const { examDate, hoursPerWeek, targetBand } = req.body;

  const prompt = `
You are an expert IELTS tutor. Based on the following inputs, generate a simple and clean 4-week IELTS study plan:
- Exam Date: ${examDate}
- Study Hours per Week: ${hoursPerWeek}
- Target Band: ${targetBand}

Return the output in this format:
Week 1:
- Listening: ...
- Reading: ...
- Writing: ...
- Speaking: ...
- Grammar: ...
Tips: ...

Week 2:
...

Keep it concise, practical, and easy to follow. Avoid repeating the prompt or including unnecessary explanations.
`;

  try {
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      }
    );

    const data = await hfResponse.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const planText = data[0]?.generated_text || "Sorry, no study plan generated. Please try again.";
    const cleanedPlan = planText.replace(prompt, "").trim();

    res.json({ plan: cleanedPlan });
  } catch (err) {
    console.error("HuggingFace API Error:", err);
    res.status(500).json({ error: "Failed to fetch from Hugging Face API" });
  }
};
