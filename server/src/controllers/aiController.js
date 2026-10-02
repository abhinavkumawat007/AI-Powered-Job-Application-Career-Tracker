const axios = require("axios");
const Application = require("../models/Application");

const askCareerAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Get the logged-in user's applications
    const applications = await Application.find({
      user: req.user._id,
    }).sort({ appliedDate: -1 });

    const totalApplications = applications.length;

    const interviews = applications.filter(
      (application) => application.status === "Interview"
    ).length;

    const offers = applications.filter(
      (application) => application.status === "Offer"
    ).length;

    const rejected = applications.filter(
      (application) => application.status === "Rejected"
    ).length;

    const screening = applications.filter(
      (application) => application.status === "Screening"
    ).length;

    const applicationData = applications.map((application) => ({
      company: application.company,
      role: application.role,
      location: application.location,
      status: application.status,
      appliedDate: application.appliedDate,
      source: application.source,
    }));

    const prompt = `
You are an AI Career Assistant inside a job application tracker.

Analyze the user's job search data and answer their question.

JOB SEARCH STATISTICS

Total applications: ${totalApplications}
Screening: ${screening}
Interviews: ${interviews}
Offers: ${offers}
Rejected: ${rejected}

APPLICATION HISTORY

${JSON.stringify(applicationData, null, 2)}

USER QUESTION

${question}

INSTRUCTIONS

- Give practical and personalized career advice.
- Use the user's actual application data.
- Do not invent information.
- If there is not enough data, say so.
- Keep the answer concise.
- Use bullet points when useful.
- Focus on actionable advice.
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
      }
    );

    const answer =
      response.data?.message?.content ||
      "I couldn't generate a response.";

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(
      "Career AI error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
    });
  }
};

module.exports = {
  askCareerAI,
};