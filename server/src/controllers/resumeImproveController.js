const axios = require("axios");

const improveResume = async (req, res) => {
  try {
    const { resumeText, section } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
    }

    if (!section || !section.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume section is required",
      });
    }

    const prompt = `
You are an expert resume writer and ATS optimization assistant.

Improve the selected resume content.

FULL RESUME:
${resumeText}

SELECTED CONTENT TO IMPROVE:
${section}

Return ONLY valid JSON using exactly this structure:

{
  "original": "",
  "improved": "",
  "changes": []
}

Rules:

- Improve clarity, professionalism, grammar, and ATS compatibility.
- Preserve the candidate's actual experience.
- Do NOT invent technologies.
- Do NOT invent achievements.
- Do NOT invent percentages or numerical results.
- Do NOT invent companies, job titles, certifications, or projects.
- Use strong action verbs where appropriate.
- Keep the improved version concise.
- Use keywords already supported by the resume when relevant.
- changes should contain 3-5 concise explanations of what was improved.
- Return ONLY valid JSON.
`;

    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: "llama3.2",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false,
        format: "json",
      }
    );

    const responseText =
      response.data?.message?.content || "{}";

    let result;

    try {
      result = JSON.parse(responseText);
    } catch (error) {
      console.error(
        "Resume improvement JSON error:",
        responseText
      );

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response",
      });
    }

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Resume improvement error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to improve resume",
    });
  }
};

module.exports = {
  improveResume,
};