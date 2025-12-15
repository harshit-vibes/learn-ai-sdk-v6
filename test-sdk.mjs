import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';

// Use standard OpenAI SDK configured for OpenRouter with compatibility mode
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  compatibility: 'compatible',
});

async function test() {
  console.log('Testing AI SDK with OpenRouter tools...\n');
  console.log('Using inputSchema (v6 style) with Claude model\n');

  try {
    const result = await generateText({
      model: openrouter.chat('anthropic/claude-sonnet-4'),
      system: 'You are a helpful assistant. When you use a tool, always respond with a summary of the results.',
      prompt: 'What is the weather in Paris? Please tell me the temperature and condition.',
      tools: {
        getWeather: {
          description: 'Get current weather for any city',
          inputSchema: z.object({
            city: z.string().describe('The city name to get weather for'),
          }),
          execute: async ({ city }) => {
            console.log('>>> Tool called with city:', city);
            return {
              city,
              temperature: 22,
              condition: 'sunny',
            };
          },
        },
      },
      maxSteps: 10,
    });

    console.log('\n=== RESULT ===');
    console.log('Final text:', result.text);
    console.log('Total steps:', result.steps?.length);

    // Show each step in detail
    result.steps?.forEach((step, i) => {
      console.log(`\n--- Step ${i + 1} ---`);
      console.log('  Text:', step.text || '(no text)');
      console.log('  Tool calls:', step.toolCalls?.length || 0);
      if (step.toolCalls?.length > 0) {
        step.toolCalls.forEach((tc) => {
          console.log('    - Tool:', tc.toolName, 'Args:', JSON.stringify(tc.args));
        });
      }
      console.log('  Tool results:', step.toolResults?.length || 0);
      if (step.toolResults?.length > 0) {
        step.toolResults.forEach((tr) => {
          console.log('    - Result:', JSON.stringify(tr.result));
        });
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
}

test();
