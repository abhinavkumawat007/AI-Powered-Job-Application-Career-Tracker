const {
    generateWithGemini,
} = require("./geminiService");

const {
    generateWithGroq,
} = require("./groqService");

const {
    createFallbackAnalysis,
} = require("./fallbackService");


const sleep = (ms) => {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    );
};


const getErrorStatus = (error) => {
    return Number(
        error?.status ??
        error?.code ??
        error?.response?.status ??
        error?.error?.code
    );
};


const generateAIAnalysis = async ({
    prompt,
    missingTechnicalSkills,
    missingSoftSkills,
    missingPreferredSkills,
}) => {

    /*
    ==========================================
    1. GEMINI
    ==========================================
    */

    try {
        console.log("🤖 Trying Gemini...");

        let response = null;

        const maxRetries = 1;

        for (
            let attempt = 0;
            attempt <= maxRetries;
            attempt++
        ) {
            try {
                response =
                    await generateWithGemini(prompt);

                console.log(
                    "✅ Gemini succeeded"
                );

                return {
                    provider: "Gemini",
                    ...response,
                };

            } catch (error) {

                const status =
                    getErrorStatus(error);

                console.error(
                    `Gemini attempt ${
                        attempt + 1
                    } failed:`,
                    error.message
                );

                const retryable =
                    status === 429 ||
                    status === 500 ||
                    status === 503;

                if (
                    !retryable ||
                    attempt === maxRetries
                ) {
                    break;
                }

                console.log(
                    "Retrying Gemini..."
                );

                await sleep(3000);
            }
        }

    } catch (error) {

        console.error(
            "Gemini unavailable:",
            error.message
        );
    }


    /*
    ==========================================
    2. GROQ
    ==========================================
    */

    try {

        console.log("⚡ Trying Groq...");

        const response =
            await generateWithGroq(prompt);

        console.log(
            "✅ Groq succeeded"
        );

        return {
            provider: "Groq",
            ...response,
        };

    } catch (error) {

        console.error(
            "Groq unavailable:",
            error.message
        );
    }


    /*
    ==========================================
    3. RULE-BASED FALLBACK
    ==========================================
    */

    console.log(
        "🧠 Using rule-based fallback..."
    );

    const fallback =
        createFallbackAnalysis({
            missingTechnicalSkills,
            missingSoftSkills,
            missingPreferredSkills,
        });

    return {
        provider: "Rule-based",
        ...fallback,
    };
};


module.exports = {
    generateAIAnalysis,
};