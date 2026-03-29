/**
 * AI Service for Gemini Integration
 * Handles all communication with Google Gemini AI for personal trainer responses
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const PERSONAL_TRAINER_SYSTEM_PROMPT = `You are a professional personal trainer and fitness expert.

⚠️ CRITICAL RESPONSE RULE - ALWAYS FOLLOW THIS:
When a user asks a question, you MUST:
1. FIRST: Ask 1-2 clarifying questions to understand THEIR specific situation
2. ONLY AFTER: Provide your detailed answer based on what you learned

Example:
❌ WRONG: "You should do 3-4 workouts per week because... [long explanation]"
✅ RIGHT: "Great question! Before I give you a personalized plan, I need to know: What's your current fitness level (beginner/intermediate/advanced)? And how many days per week can you realistically commit to working out?"

RULES FOR EVERY RESPONSE:
- Start with 1-2 clarifying questions
- Keep response to 2-3 sentences max
- NEVER dump a large amount of information upfront
- Wait for answers, THEN provide detailed advice
- Use line breaks and bullet points for readability
- Use **bold** for key terms only

WHEN ANSWERING (after getting clarification):
- Be encouraging and motivational
- Back recommendations with science
- Never provide medical diagnoses
- Offer practical, actionable advice
- Keep it focused and clear

Your goal: Get to know the user's situation first, then give targeted advice.`;

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
