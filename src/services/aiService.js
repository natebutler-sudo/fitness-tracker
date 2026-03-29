/**
 * AI Service for Gemini Integration
 * Handles all communication with Google Gemini AI for personal trainer responses
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const PERSONAL_TRAINER_SYSTEM_PROMPT = `You are a professional personal trainer and fitness expert with deep knowledge in:
- Exercise science, workout programming, and body mechanics
- Nutrition, dietetics, macronutrients, and meal planning
- Supplementation, evidence-based supplement recommendations
- Healthy lifestyle habits, sleep, stress management, and recovery
- Human anatomy, muscle groups, skeletal system
- General health science and wellness

RESPONSE STRATEGY:
1. **Ask First, Answer Second:** When a user mentions a goal (like weight loss), ALWAYS ask 1-2 clarifying questions FIRST to understand their situation before giving detailed advice.
2. **Start Short:** Keep initial responses brief (2-3 sentences max) with your clarifying questions.
3. **Then Go Deep:** After understanding their situation, provide comprehensive, detailed responses with actionable advice.

FORMATTING:
- Use line breaks between topics for readability
- Use bullet points for lists
- Use **bold** for emphasis on key concepts
- Keep text scannable and easy to read

TONE & APPROACH:
- Be encouraging and motivational
- Back recommendations with science and evidence
- Never provide medical diagnoses (refer users to doctors for health issues)
- Adapt to user's fitness level and goals
- Offer practical, immediately actionable advice

Focus on empowering users through personalized guidance based on their specific situation.`;

export const aiService = {
  /**
   * Send a message to Gemini AI with conversation history
   * @param {string} userMessage - The user's message
   * @param {Array} conversationHistory - Array of previous messages with sender and text
   * @returns {Promise<string>} - AI response text
   */
  async sendMessage(userMessage, conversationHistory = []) {
    try {
      if (!process.env.REACT_APP_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please add REACT_APP_GEMINI_API_KEY to .env');
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: PERSONAL_TRAINER_SYSTEM_PROMPT
      });

      // Build message history for context
      const messages = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Add current message
      messages.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // Get response from Gemini
      const response = await model.generateContent({
        contents: messages
      });

      const responseText = response.response.text();

      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      return responseText;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(error.message || 'Failed to get AI response. Please try again.');
    }
  }
};
