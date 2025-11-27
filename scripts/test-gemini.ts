import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import path from 'path';

// Load env from apps/api/.env
config({ path: path.resolve(__dirname, '../apps/api/.env') });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    // There isn't a direct listModels method on the instance in older versions, 
    // but let's try to just run a simple prompt on a few common names to see which works.
    
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-001',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro'
    ];

    console.log('Testing models...');
    
    for (const modelName of modelsToTry) {
      process.stdout.write(`Testing ${modelName}... `);
      try {
        const m = genAI.getGenerativeModel({ model: modelName });
        await m.generateContent('Hello');
        console.log('✅ SUCCESS');
      } catch (e: any) {
        console.log(`❌ FAILED: ${e.message.split('\n')[0]}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
