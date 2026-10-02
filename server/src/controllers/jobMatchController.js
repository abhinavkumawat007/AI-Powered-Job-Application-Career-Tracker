const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const {
    generateAIAnalysis,
} = require("../services/ai/aiService");

// ======================================================
// SKILL DEFINITIONS
// ======================================================

const SKILLS = {
    // Programming
    javascript: {
        name: "JavaScript",
        category: "technical",
        aliases: ["javascript", "js", "ecmascript"],
    },

    typescript: {
        name: "TypeScript",
        category: "technical",
        aliases: ["typescript", "ts"],
    },

    python: {
        name: "Python",
        category: "technical",
        aliases: ["python"],
    },

    java: {
        name: "Java",
        category: "technical",
        aliases: ["java"],
    },

    cpp: {
        name: "C++",
        category: "technical",
        aliases: ["c++", "cpp"],
    },

    // Frontend
    react: {
        name: "React.js",
        category: "technical",
        aliases: ["react.js", "reactjs", "react"],
    },

    html: {
        name: "HTML",
        category: "technical",
        aliases: ["html"],
    },

    css: {
        name: "CSS",
        category: "technical",
        aliases: ["css"],
    },

    // Backend
    nodejs: {
        name: "Node.js",
        category: "technical",
        aliases: ["node.js", "nodejs"],
    },

    express: {
        name: "Express.js",
        category: "technical",
        aliases: ["express.js", "expressjs"],
    },

    restApis: {
        name: "REST APIs",
        category: "technical",
        aliases: [
            "rest api",
            "rest apis",
            "restful api",
            "restful apis",
        ],
    },

    // Databases
    mongodb: {
        name: "MongoDB",
        category: "technical",
        aliases: ["mongodb", "mongo db"],
    },

    mysql: {
        name: "MySQL",
        category: "technical",
        aliases: ["mysql"],
    },

    postgresql: {
        name: "PostgreSQL",
        category: "technical",
        aliases: ["postgresql", "postgres"],
    },

    sql: {
        name: "SQL",
        category: "technical",
        aliases: ["sql"],
    },

    // Tools
    git: {
        name: "Git",
        category: "technical",
        aliases: ["git"],
    },

    github: {
        name: "GitHub",
        category: "technical",
        aliases: ["github"],
    },

    docker: {
        name: "Docker",
        category: "technical",
        aliases: ["docker"],
    },

    aws: {
        name: "AWS",
        category: "technical",
        aliases: [
            "aws",
            "amazon web services",
        ],
    },

    // ML / Data
    tensorflow: {
        name: "TensorFlow",
        category: "technical",
        aliases: ["tensorflow"],
    },

    pytorch: {
        name: "PyTorch",
        category: "technical",
        aliases: ["pytorch"],
    },

    pandas: {
        name: "Pandas",
        category: "technical",
        aliases: ["pandas"],
    },

    numpy: {
        name: "NumPy",
        category: "technical",
        aliases: ["numpy"],
    },

    scikitlearn: {
        name: "Scikit-learn",
        category: "technical",
        aliases: [
            "scikit-learn",
            "sklearn",
        ],
    },

    streamlit: {
        name: "Streamlit",
        category: "technical",
        aliases: ["streamlit"],
    },

    machineLearning: {
        name: "Machine Learning",
        category: "technical",
        aliases: [
            "machine learning",
            "machine-learning",
        ],
    },

    dataStructures: {
        name: "Data Structures & Algorithms",
        category: "technical",
        aliases: [
            "data structures",
            "data structures and algorithms",
            "data structures & algorithms",
            "dsa",
        ],
    },

    // Soft skills
    problemSolving: {
        name: "Problem Solving",
        category: "soft",
        aliases: [
            "problem solving",
            "problem-solving",
            "problem solving skills",
        ],
    },

    communication: {
        name: "Communication Skills",
        category: "soft",
        aliases: [
            "communication skills",
            "good communication",
            "strong communication",
            "verbal communication",
            "written communication",
        ],
    },
};

// ======================================================
// TEXT NORMALIZATION
// ======================================================

const normalizeText = (text) => {
    return String(text || "")
        .toLowerCase()
        .replace(/[–—]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
};

// ======================================================
// WORD-SAFE SKILL MATCHING
// ======================================================

const containsSkill = (text, alias) => {
    const normalizedText = normalizeText(text);
    const normalizedAlias = normalizeText(alias);

    if (!normalizedText || !normalizedAlias) {
        return false;
    }

    /*
      Word-safe matching prevents:

      Java

      from incorrectly matching:

      JavaScript
    */

    const escapedAlias = normalizedAlias.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(
        `(^|[^a-z0-9+#])${escapedAlias}(?=$|[^a-z0-9+#])`,
        "i"
    );

    return regex.test(normalizedText);
};

// ======================================================
// EXTRACT SKILLS
// ======================================================

const extractSkills = (text) => {
    const detected = [];

    for (const [key, skill] of Object.entries(SKILLS)) {
        const found = skill.aliases.some((alias) =>
            containsSkill(text, alias)
        );

        if (found) {
            detected.push(key);
        }
    }

    return detected;
};

// ======================================================
// REMOVE DUPLICATES
// ======================================================

const unique = (items) => {
    return [...new Set(items)];
};

// ======================================================
// EXTRACT REQUIRED + PREFERRED SECTIONS
// ======================================================

const extractJobSections = (jobDescription) => {
    const text = jobDescription.trim();

    /*
      Example:

      Requirements:
      JavaScript
      React

      Preferred:
      Docker
      AWS
    */

    const preferredRegex =
        /\bpreferred\b\s*:?\s*/i;

    const match = text.match(preferredRegex);

    if (
        !match ||
        match.index === undefined
    ) {
        return {
            requiredText: text,
            preferredText: "",
        };
    }

    const requiredText =
        text.slice(0, match.index);

    const preferredText =
        text.slice(
            match.index + match[0].length
        );

    return {
        requiredText,
        preferredText,
    };
};

// ======================================================
// CONVERT SKILL KEYS TO DISPLAY NAMES
// ======================================================

const displaySkills = (skills) => {
    return skills.map(
        (skill) =>
            SKILLS[skill]?.name || skill
    );
};

// ======================================================
// EXTRACT RESUME EVIDENCE FOR A SKILL
// ======================================================

const getSkillEvidence = (
    resumeText,
    skillKey
) => {
    const skill = SKILLS[skillKey];

    if (!skill) {
        return null;
    }

    const lines = String(resumeText || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    for (const line of lines) {
        const found = skill.aliases.some(
            (alias) =>
                containsSkill(line, alias)
        );

        if (found) {
            return line
                .replace(/^[-•●▪◦]\s*/, "")
                .trim();
        }
    }

    return null;
};

// ======================================================
// FILTER KEYWORD GAPS USING RESUME EVIDENCE
// ======================================================

const keywordAlreadyCovered = (
    keyword,
    resumeText
) => {
    const text = normalizeText(resumeText);

    const keywordMap = {
        "full-stack development": [
            "full stack",
            "full-stack",
            "full stack web application",
            "mern stack",
        ],

        "api development": [
            "api",
            "apis",
            "rest api",
            "rest apis",
            "restful api",
            "restful apis",
        ],

        "backend development": [
            "backend development",
            "back-end development",
            "server-side development",
            "backend developer",
        ],

        "cloud deployment": [
            "cloud deployment",
            "deployed on aws",
            "aws deployment",
            "cloud",
        ],

        "containerization": [
            "docker",
            "container",
            "containers",
            "containerized",
        ],
    };

    const normalizedKeyword =
        normalizeText(keyword);

    const aliases =
        keywordMap[normalizedKeyword];

    if (!aliases) {
        return false;
    }

    return aliases.some((alias) =>
        containsSkill(text, alias)
    );
};

// ======================================================
// MAIN CONTROLLER
// ======================================================

const matchJobDescription = async (
    req,
    res
) => {
    let uploadedFilePath = null;

    try {
        // ------------------------------------------------
        // 1. Check resume
        // ------------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required.",
            });
        }

        uploadedFilePath = req.file.path;

        // ------------------------------------------------
        // 2. Check job description
        // ------------------------------------------------

        const {
            jobDescription,
        } = req.body;

        if (
            !jobDescription ||
            !jobDescription.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Job description is required.",
            });
        }

        // ------------------------------------------------
        // 3. Extract PDF text
        // ------------------------------------------------

        const pdfBuffer =
            fs.readFileSync(
                uploadedFilePath
            );

        const parser = new PDFParse({
            data: pdfBuffer,
        });

        const pdfData =
            await parser.getText();

        await parser.destroy();

        const resumeText =
            pdfData.text.trim();

        if (!resumeText) {
            return res.status(400).json({
                success: false,
                message:
                    "Could not extract text from this PDF.",
            });
        }

        // ------------------------------------------------
        // 4. Separate required + preferred
        // ------------------------------------------------

        const {
            requiredText,
            preferredText,
        } = extractJobSections(
            jobDescription
        );

        // ------------------------------------------------
        // 5. Extract resume skills
        // ------------------------------------------------

        const resumeSkillKeys =
            unique(
                extractSkills(
                    resumeText
                )
            );

        // ------------------------------------------------
        // 6. Extract job skills
        // ------------------------------------------------

        const requiredJobSkillKeys =
            unique(
                extractSkills(
                    requiredText
                )
            );

        const preferredJobSkillKeys =
            unique(
                extractSkills(
                    preferredText
                )
            );

        // ------------------------------------------------
        // 7. Compare REQUIRED skills
        // ------------------------------------------------

        const matchedRequiredKeys =
            requiredJobSkillKeys.filter(
                (skill) =>
                    resumeSkillKeys.includes(
                        skill
                    )
            );

        const missingRequiredKeys =
            requiredJobSkillKeys.filter(
                (skill) =>
                    !resumeSkillKeys.includes(
                        skill
                    )
            );

        // ------------------------------------------------
        // 8. Compare PREFERRED skills
        // ------------------------------------------------

        const matchedPreferredKeys =
            preferredJobSkillKeys.filter(
                (skill) =>
                    resumeSkillKeys.includes(
                        skill
                    )
            );

        const missingPreferredKeys =
            preferredJobSkillKeys.filter(
                (skill) =>
                    !resumeSkillKeys.includes(
                        skill
                    )
            );

        // ------------------------------------------------
        // 9. Separate technical + soft skills
        // ------------------------------------------------

        const requiredTechnicalKeys =
            requiredJobSkillKeys.filter(
                (skill) =>
                    SKILLS[skill]?.category ===
                    "technical"
            );

        const requiredSoftKeys =
            requiredJobSkillKeys.filter(
                (skill) =>
                    SKILLS[skill]?.category ===
                    "soft"
            );

        const matchedRequiredTechnicalKeys =
            matchedRequiredKeys.filter(
                (skill) =>
                    SKILLS[skill]?.category ===
                    "technical"
            );

        const matchedRequiredSoftKeys =
            matchedRequiredKeys.filter(
                (skill) =>
                    SKILLS[skill]?.category ===
                    "soft"
            );

        const missingRequiredTechnicalKeys =
            missingRequiredKeys.filter(
                (skill) =>
                    SKILLS[skill]?.category ===
                    "technical"
            );

        const missingRequiredSoftKeys =
            missingRequiredKeys.filter(
                (skill) =>
                    SKILLS[skill]?.category ===
                    "soft"
            );

        // ------------------------------------------------
        // 10. Calculate score
        //
        // Required = 75%
        // Preferred = 25%
        // ------------------------------------------------

        let requiredScore = 75;
        let preferredScore = 25;

        if (
            requiredJobSkillKeys.length > 0
        ) {
            requiredScore =
                (
                    matchedRequiredKeys.length /
                    requiredJobSkillKeys.length
                ) * 75;
        }

        if (
            preferredJobSkillKeys.length > 0
        ) {
            preferredScore =
                (
                    matchedPreferredKeys.length /
                    preferredJobSkillKeys.length
                ) * 25;
        }

        const matchScore =
            Math.round(
                requiredScore +
                preferredScore
            );

        // ------------------------------------------------
        // 11. Display names
        // ------------------------------------------------

        const matchedSkills =
            displaySkills(
                unique([
                    ...matchedRequiredKeys,
                    ...matchedPreferredKeys,
                ])
            );

// ------------------------------------------------
// Matched skill evidence
// ------------------------------------------------

const matchedSkillEvidence =
    unique([
        ...matchedRequiredKeys,
        ...matchedPreferredKeys,
    ]).map((skillKey) => ({
        skill:
            SKILLS[skillKey]?.name ||
            skillKey,

        evidence:
            getSkillEvidence(
                resumeText,
                skillKey
            ) ||
            "Found in resume",
    }));           

        const missingSkills =
            displaySkills(
                unique([
                    ...missingRequiredKeys,
                    ...missingPreferredKeys,
                ])
            );

// ------------------------------------------------
// Missing skill evidence
// ------------------------------------------------

const missingSkillEvidence =
    unique([
        ...missingRequiredKeys,
        ...missingPreferredKeys,
    ]).map((skillKey) => ({
        skill:
            SKILLS[skillKey]?.name ||
            skillKey,

        evidence:
            "Not explicitly demonstrated in resume",
    }));            

        const requiredSkills =
            displaySkills(
                requiredJobSkillKeys
            );

        const preferredSkills =
            displaySkills(
                preferredJobSkillKeys
            );

        const matchedRequiredSkills =
            displaySkills(
                matchedRequiredKeys
            );

        const missingRequiredSkills =
            displaySkills(
                missingRequiredKeys
            );

        const matchedPreferredSkills =
            displaySkills(
                matchedPreferredKeys
            );

        const missingPreferredSkills =
            displaySkills(
                missingPreferredKeys
            );

        // ------------------------------------------------
        // 12. Technical + soft display data
        // ------------------------------------------------

        const matchedTechnicalSkills =
            displaySkills(
                unique([
                    ...matchedRequiredTechnicalKeys,

                    ...matchedPreferredKeys.filter(
                        (skill) =>
                            SKILLS[skill]?.category ===
                            "technical"
                    ),
                ])
            );

        const missingTechnicalSkills =
            displaySkills(
                unique([
                    ...missingRequiredTechnicalKeys,

                    ...missingPreferredKeys.filter(
                        (skill) =>
                            SKILLS[skill]?.category ===
                            "technical"
                    ),
                ])
            );

        const matchedSoftSkills =
            displaySkills(
                unique([
                    ...matchedRequiredSoftKeys,

                    ...matchedPreferredKeys.filter(
                        (skill) =>
                            SKILLS[skill]?.category ===
                            "soft"
                    ),
                ])
            );

        const missingSoftSkills =
            displaySkills(
                unique([
                    ...missingRequiredSoftKeys,

                    ...missingPreferredKeys.filter(
                        (skill) =>
                            SKILLS[skill]?.category ===
                            "soft"
                    ),
                ])
            );

        // ------------------------------------------------
        // 13. AI qualitative analysis
        //
        // IMPORTANT:
        // Score is calculated above by backend.
        //
        // AI only generates:
        // - summary
        // - keyword gaps
        // - recommendations
        //
        // AI chain:
        // Gemini → Groq → Rule-based
        // ------------------------------------------------

        const prompt = `
You are an expert technical recruiter.

Analyze a candidate's resume against a job description.

IMPORTANT:

The backend has already calculated the match score.

You MUST NOT calculate or modify the score.

You MUST NOT invent skills or experience.

========================================
JOB DESCRIPTION
========================================

${jobDescription}

========================================
REQUIRED SKILLS
========================================

${
    requiredSkills.length
        ? requiredSkills.join(", ")
        : "None"
}

========================================
PREFERRED SKILLS
========================================

${
    preferredSkills.length
        ? preferredSkills.join(", ")
        : "None"
}

========================================
MATCHED SKILLS
========================================

${
    matchedSkills.length
        ? matchedSkills.join(", ")
        : "None"
}

========================================
MISSING SKILLS
========================================

${
    missingSkills.length
        ? missingSkills.join(", ")
        : "None"
}

========================================
MISSING TECHNICAL SKILLS
========================================

${
    missingTechnicalSkills.length
        ? missingTechnicalSkills.join(", ")
        : "None"
}

========================================
MISSING SOFT SKILLS
========================================

${
    missingSoftSkills.length
        ? missingSoftSkills.join(", ")
        : "None"
}

========================================
RESUME
========================================

${resumeText}

========================================
YOUR TASK
========================================

Return ONLY valid JSON using this structure:

{
  "summary": "",
  "keywordGaps": [],
  "recommendations": []
}

SUMMARY:

- Write 2-3 concise sentences.
- Explain the actual alignment between the resume and job.
- Mention important matched areas.
- Mention important missing areas.
- Do not mention a score.
- Do not invent experience.

KEYWORD GAPS:

- Return 2-5 important concepts from the job description that are NOT meaningfully demonstrated in the resume.
- Consider semantic meaning, not only exact keyword matches.
- Do NOT report a keyword gap if the resume already demonstrates the concept using different wording.
- For example:
  - "Full Stack Web Application" covers "full-stack development".
  - "MERN stack" is evidence of full-stack web development.
  - "REST APIs" covers "API development".
  - "Docker" covers "containerization".
  - "AWS deployment" covers "cloud deployment".
- Do NOT repeat anything already present in the missing skills list.
- Do NOT invent requirements.
- Focus on broader concepts such as:
  - backend development
  - API development
  - full-stack development
  - cloud deployment
  - containerization
- Only return a keyword if the resume does not provide meaningful evidence for it.

RECOMMENDATIONS:

- Return 3-5 practical recommendations.
- Base them only on actual missing skills and keyword gaps.
- Recommend learning, projects, or resume improvements.
- Never tell the candidate to falsely claim a skill.
- Keep each recommendation concise.

Return ONLY JSON.
`;

        // ------------------------------------------------
        // 14. AI FALLBACK CHAIN
        // ------------------------------------------------

        const aiResult =
            await generateAIAnalysis({
                prompt,

                missingTechnicalSkills,

                missingSoftSkills,

                missingPreferredSkills,
            });

        const {
    provider,
    summary,
    keywordGaps: aiKeywordGaps,
    recommendations,
} = aiResult;

const filteredKeywordGaps =
    aiKeywordGaps.filter(
        (keyword) =>
            !keywordAlreadyCovered(
                keyword,
                resumeText
            )
    );

        // ------------------------------------------------
        // 15. Final response
        // ------------------------------------------------

        return res.json({
            success: true,

            result: {
                // Score
                matchScore,

                // AI provider
                provider,

                // Overall skills
                matchedSkills,
                missingSkills,

                matchedSkillEvidence,
                missingSkillEvidence,

                // AI analysis
                summary,
                keywordGaps: filteredKeywordGaps,
                recommendations,

                // Required
                requiredSkills,
                matchedRequiredSkills,
                missingRequiredSkills,

                // Preferred
                preferredSkills,
                matchedPreferredSkills,
                missingPreferredSkills,

                // Technical
                matchedTechnicalSkills,
                missingTechnicalSkills,

                // Soft skills
                matchedSoftSkills,
                missingSoftSkills,

                // Score breakdown
                breakdown: {
                    required: {
                        matched:
                            matchedRequiredKeys.length,

                        total:
                            requiredJobSkillKeys.length,

                        percentage:
                            requiredJobSkillKeys.length
                                ? Math.round(
                                      (
                                          matchedRequiredKeys.length /
                                          requiredJobSkillKeys.length
                                      ) * 100
                                  )
                                : 100,

                        contribution:
                            Math.round(
                                requiredScore
                            ),
                    },

                    preferred: {
                        matched:
                            matchedPreferredKeys.length,

                        total:
                            preferredJobSkillKeys.length,

                        percentage:
                            preferredJobSkillKeys.length
                                ? Math.round(
                                      (
                                          matchedPreferredKeys.length /
                                          preferredJobSkillKeys.length
                                      ) * 100
                                  )
                                : 100,

                        contribution:
                            Math.round(
                                preferredScore
                            ),
                    },
                },
            },
        });

    } catch (error) {
        console.error(
            "Job matching error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to analyze job match.",
        });

    } finally {
        // ------------------------------------------------
        // Delete temporary uploaded PDF
        // ------------------------------------------------

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
                            error
                        );
                    }
                }
            );
        }
    }
};

module.exports = {
    matchJobDescription,
};