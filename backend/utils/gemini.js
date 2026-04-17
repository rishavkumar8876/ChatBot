import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(message);
        return result.response.text();
    } catch (err) {
        console.error("Gemini API Error:", err);
        throw new Error("Failed to fetch response from Gemini");
    }
};

export default getGeminiAPIResponse;
