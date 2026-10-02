const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
    if (groqClient) {
        return groqClient;
    }

    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    groqClient = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    return groqClient;
};

const generateWithGroq = async (prompt) => {
    const groq = getGroqClient();

    const completion =
        await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert resume and job matching assistant. Return only valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
        });

    const content =
        completion.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("Groq returned an empty response");
    }

    return JSON.parse(content);
};

module.exports = {
    generateWithGroq,
};