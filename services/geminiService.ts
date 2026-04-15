
import { GoogleGenAI } from "@google/genai";
import { Course } from '../types';

// Fix: Always use the direct process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCourseSummary = async (course: Course): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a catchy one-sentence summary for a course titled "${course.title}" with description: "${course.description}".`
    });
    return response.text || course.description;
  } catch (error) {
    return course.description;
  }
};
