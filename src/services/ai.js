import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function analyzeErrorWithAI(parsedData) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables.');
  }

  const modelName = 'gemini-3.8-flash'; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const prompt = `
You are a highly intelligent, friendly, and to-the-point AI assistant for debugging Node.js applications in the terminal.
Below is the error data from a developer's Node.js application.:

- Error Message: ${parsedData.errorMessage}
- Rescource File: ${parsedData.targetFile}:${parsedData.targetLine}
- Code Snippet:
\`\`\`javascript
${parsedData.codeSnippet || 'No code snippet'}
\`\`\`

- Full Stack Trace:
\`\`\`
${parsedData.fullStackTrace}
\`\`\`

Provide an analysis in Indonesian using the following format:
1. **Root Cause**: A brief explanation of why this error occurs.
2. **Fix/Solution**: Concrete steps to correct the code.
  `.trim();

  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 [Whisper] Contacting Gemini AI (Attempt ${attempt}/${maxRetries})...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (textResponse) {
          return textResponse;
        }
        throw new Error('The JSON response format from Gemini is invalid.');
      }

      if (response.status === 503 && attempt < maxRetries) {
        console.log(`⚠️ [Whisper] Gemini sibuk (503). Waiting 2 seconds before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      const errorBody = await response.text();
      throw new Error(`API Error (${response.status}): ${errorBody}`);

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log(`⚠️ [Whisper] Request timeout (taking too long to respond).`);
      }

      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempt: ${err.message}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}