import { config } from 'dotenv';
import path from 'path';

// Load env from apps/api/.env
config({ path: path.resolve(__dirname, '../apps/api/.env') });

async function listModelsRaw() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching models:', data);
      return;
    }

    console.log('Available Models:');
    if (data.models) {
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('No models found in response:', data);
    }

  } catch (error) {
    console.error('Network Error:', error);
  }
}

listModelsRaw();
