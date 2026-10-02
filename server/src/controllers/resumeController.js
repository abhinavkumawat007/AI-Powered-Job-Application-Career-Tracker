const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const {
  generateAIAnalysis,
} = require("../services/ai/aiService");

// ======================================================
// HELPERS
// ======================================================

const normalizeText = (text) => {
  return String(text || "")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
};

const containsSkill = (text, skill) => {
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skill);

  if (!normalizedText || !normalizedSkill) {
    return false;
  }

  const escapedSkill = normalizedSkill.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(^|[^a-z0-9+#])${escapedSkill}(?=$|[^a-z0-9+#])`,
    "i"
  );

  return regex.test(normalizedText);
};

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

// ======================================================
// ATS SCORE CALCULATION
// ======================================================

const calculateATSScore = (resumeText) => {
  const text = normalizeText(resumeText);

  // ----------------------------------------------------
  // 1. Contact Information — 10
  // ----------------------------------------------------

  let contactScore = 0;

  const emailRegex =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  const phoneRegex =
    /\b(\+91[\s-]?)?[6-9]\d{9}\b/;

  if (emailRegex.test(resumeText)) {
    contactScore += 4;
  }

  if (phoneRegex.test(resumeText)) {
    contactScore += 3;
  }

  if (text.includes("linkedin")) {
    contactScore += 1.5;
  }

  if (text.includes("github")) {
    contactScore += 1.5;
  }

  // ----------------------------------------------------
  // 2. Resume Sections — 15
  // ----------------------------------------------------

  let sectionScore = 0;

  const sections = [
    "education",
    "skills",
    "projects",
    "experience",
    "certifications",
  ];

  sections.forEach((section) => {
    if (text.includes(section)) {
      sectionScore += 3;
    }
  });

  sectionScore = Math.min(sectionScore, 15);

  // ----------------------------------------------------
  // 3. Technical Skills — 20
  // ----------------------------------------------------

  const technicalSkills = [
    "c++",
    "c",
    "java",
    "python",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "nodejs",
    "express",
    "mongodb",
    "sql",
    "mysql",
    "postgresql",
    "html",
    "css",
    "git",
    "github",
    "docker",
    "aws",
    "machine learning",
    "data science",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
  ];

  const detectedSkills = technicalSkills.filter((skill) =>
    containsSkill(resumeText, skill)
  );

  const skillScore = Math.min(
    Math.round((detectedSkills.length / 10) * 20),
    20
  );

  // ----------------------------------------------------
  // 4. Projects — 15
  // ----------------------------------------------------

  let projectScore = 0;

  if (
    text.includes("project") ||
    text.includes("projects")
  ) {
    projectScore += 7;
  }

  const projectKeywords = [
    "developed",
    "built",
    "implemented",
    "created",
    "designed",
  ];

  const projectActionWords = projectKeywords.filter((word) =>
    text.includes(word)
  );

  if (projectActionWords.length >= 2) {
    projectScore += 4;
  }

  const containsNumbers =
    /\b\d+\+?\b/.test(resumeText);

  if (text.includes("%") || containsNumbers) {
    projectScore += 4;
  }

  projectScore = Math.min(projectScore, 15);

  // ----------------------------------------------------
  // 5. Experience — 15
  // ----------------------------------------------------

  let experienceScore = 0;

  if (
    text.includes("experience") ||
    text.includes("internship") ||
    text.includes("intern")
  ) {
    experienceScore += 8;
  }

  if (
    text.includes("responsibilities") ||
    text.includes("worked") ||
    text.includes("developed")
  ) {
    experienceScore += 4;
  }

  if (
    text.includes("intern") ||
    text.includes("internship")
  ) {
    experienceScore += 3;
  }

  experienceScore = Math.min(experienceScore, 15);

  // ----------------------------------------------------
  // 6. Education — 10
  // ----------------------------------------------------

  let educationScore = 0;

  if (
    text.includes("education") ||
    text.includes("b.tech") ||
    text.includes("btech") ||
    text.includes("bachelor")
  ) {
    educationScore += 6;
  }

  if (
    text.includes("cgpa") ||
    text.includes("gpa") ||
    text.includes("percentage")
  ) {
    educationScore += 4;
  }

  educationScore = Math.min(educationScore, 10);

  // ----------------------------------------------------
  // 7. ATS-Friendly Formatting — 15
  // ----------------------------------------------------

  let formattingScore = 0;

  const wordCount = resumeText
    .split(/\s+/)
    .filter(Boolean).length;

  if (wordCount >= 300) {
    formattingScore += 5;
  }

  if (wordCount <= 1200) {
    formattingScore += 4;
  }

  if (!text.includes("table")) {
    formattingScore += 2;
  }

  if (!text.includes("image")) {
    formattingScore += 2;
  }

  if (resumeText.includes("\n")) {
    formattingScore += 2;
  }

  formattingScore = Math.min(formattingScore, 15);

  // ----------------------------------------------------
  // FINAL SCORE
  // ----------------------------------------------------

  const totalScore =
    contactScore +
    sectionScore +
    skillScore +
    projectScore +
    experienceScore +
    educationScore +
    formattingScore;

  return {
    total: Math.min(Math.round(totalScore), 100),

    breakdown: {
      contactInformation: Math.round(contactScore),
      resumeSections: Math.round(sectionScore),
      technicalSkills: skillScore,
      projects: Math.round(projectScore),
      experience: Math.round(experienceScore),
      education: Math.round(educationScore),
      atsFormatting: Math.round(formattingScore),
    },

    detectedSkills,
  };
};

// ======================================================
// RESUME ANALYZER
// ======================================================

const analyzeResume = async (req, res) => {
  let uploadedFilePath = null;

  try {
    // --------------------------------------------------
    // 1. CHECK FILE
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    uploadedFilePath = req.file.path;

    // --------------------------------------------------
    // 2. READ PDF
    // --------------------------------------------------

    const pdfBuffer = fs.readFileSync(
      uploadedFilePath
    );

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    let pdfData;

    try {
      pdfData = await parser.getText();
    } finally {
      await parser.destroy();
    }

    const resumeText = String(
      pdfData.text || ""
    ).trim();

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract text from this PDF. Please upload a text-based PDF.",
      });
    }

    // --------------------------------------------------
    // 3. ATS SCORE
    // --------------------------------------------------

    const atsResult =
      calculateATSScore(resumeText);

    console.log(
      "ATS RESULT:",
      JSON.stringify(
        atsResult,
        null,
        2
      )
    );

    // --------------------------------------------------
    // 4. AI PROMPT
    // --------------------------------------------------

    const prompt = `
You are an expert resume analyzer and ATS consultant.

Analyze the following resume.

==================================================
RESUME
==================================================

${resumeText}

==================================================
ATS INFORMATION
==================================================

The ATS score has already been calculated by the backend.

ATS SCORE:
${atsResult.total}/100

ATS SCORE BREAKDOWN:
${JSON.stringify(
  atsResult.breakdown,
  null,
  2
)}

DETECTED SKILLS:
${JSON.stringify(
  atsResult.detectedSkills,
  null,
  2
)}

==================================================
IMPORTANT RULES
==================================================

1. Do NOT calculate or change the ATS score.
2. Do NOT invent experience, projects, education, skills, or achievements.
3. Only use information supported by the resume.
4. Keep responses concise and useful.
5. Return ONLY valid JSON.

==================================================
OUTPUT FORMAT
==================================================

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "skills": [],
  "missingSkills": [],
  "suggestions": []
}

==================================================
FIELD RULES
==================================================

summary:
- Write 2-3 concise sentences.
- Describe the candidate's actual profile.
- Mention important strengths and areas that need improvement.

strengths:
- Return 3-5 useful points.
- Base them only on evidence from the resume.

weaknesses:
- Return 3-5 useful points.
- Identify genuine weaknesses or missing resume elements.

skills:
- Return technical skills actually present in the resume.
- Do not invent skills.

missingSkills:
- Return reasonable technical skills that could improve the candidate's profile.
- Do not claim that the candidate already has them.

suggestions:
- Return 4-6 actionable improvements.
- Focus on resume quality, clarity, ATS optimization, projects, skills, and measurable achievements.
- Never tell the candidate to falsely claim a skill.
`;

    // --------------------------------------------------
    // 5. GEMINI → GROQ → RULE-BASED
    // --------------------------------------------------

    const aiResult =
      await generateAIAnalysis({
        prompt,

        // These are used only by the final
        // rule-based fallback.
        missingTechnicalSkills: [],
        missingSoftSkills: [],
        missingPreferredSkills: [],
      });

    // --------------------------------------------------
    // 6. AI RESULT
    // --------------------------------------------------

    const {
      provider,
      summary,
      strengths,
      weaknesses,
      missingSkills,
      suggestions,
    } = aiResult;

    // --------------------------------------------------
    // 7. FINAL RESPONSE
    // --------------------------------------------------

    return res.json({
      success: true,

      analysis: {
        // Deterministic ATS score
        atsScore: atsResult.total,

        // Score breakdown
        atsBreakdown:
          atsResult.breakdown,

        // Deterministic detected skills
        skills:
          atsResult.detectedSkills,

        // AI analysis
        summary:
          typeof summary === "string"
            ? summary
            : "",

        strengths:
          safeArray(strengths),

        weaknesses:
          safeArray(weaknesses),

        missingSkills:
          safeArray(missingSkills),

        suggestions:
          safeArray(suggestions),

        // AI provider
        provider:
          provider || "Rule-based",
      },
    });

  } catch (error) {
    console.error(
      "Resume analysis error:",
      error.response?.data ||
        error.message ||
        error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to analyze resume",
    });

  } finally {
    // --------------------------------------------------
    // DELETE TEMPORARY PDF
    // --------------------------------------------------

    if (uploadedFilePath) {
      fs.unlink(
        uploadedFilePath,
        (error) => {
          if (
            error &&
            error.code !== "ENOENT"
          ) {
            console.error(
              "Failed to delete temporary resume:",
              error.message
            );
          }
        }
      );
    }
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  analyzeResume,
};