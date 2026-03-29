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

You provide personalized, professional guidance while:
- Being encouraging and motivational
- Asking clarifying questions when needed to give better advice
- Backing recommendations with science and evidence
- Never providing medical diagnoses (refer users to doctors for health issues)
- Adapting responses to user's fitness level and goals
- Offering practical, actionable advice they can implement immediately

Keep responses concise but thorough (2-3 paragraphs max). Use a friendly, professional tone.
Focus on empowering users to make informed decisions about their fitness and health.`;

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
        model: "gemini-2.0-flash",
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
