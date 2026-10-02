let geminiClient = null;

const getGeminiClient = async () => {
    if (geminiClient) {
        return geminiClient;
    }

    const { GoogleGenAI } = await import("@google/genai");

    geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    return geminiClient;
};

const generateWithGemini = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = await getGeminiClient();

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    summary: {
                        type: "string",
                    },
                    keywordGaps: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    recommendations: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
                required: [
                    "summary",
                    "keywordGaps",
                    "recommendations",
                ],
            },
        },
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty response");
    }

    return JSON.parse(response.text);
};

module.exports = {
    generateWithGemini,
};