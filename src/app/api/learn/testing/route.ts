export const maxDuration = 30

interface MockConfig {
  mockText: string
  promptTokens: number
  completionTokens: number
  finishReason: 'stop' | 'length' | 'tool-calls'
  testPrompt: string
}

export async function POST(req: Request) {
  const config: MockConfig = await req.json()

  const startTime = Date.now()

  // Simulate what a real mock test would do
  // In a real test environment, you would use MockLanguageModelV3
  // This demo shows the concept without the complex type requirements

  try {
    // Simulate mock model execution
    await new Promise(resolve => setTimeout(resolve, 100))

    const mockResult = {
      text: config.mockText,
      finishReason: config.finishReason,
      usage: {
        inputTokens: config.promptTokens,
        outputTokens: config.completionTokens,
      },
    }

    const duration = Date.now() - startTime

    // Perform assertions
    const assertions = [
      {
        name: 'result.text matches mock',
        passed: mockResult.text === config.mockText,
        expected: config.mockText,
        actual: mockResult.text,
      },
      {
        name: 'finishReason matches',
        passed: mockResult.finishReason === config.finishReason,
        expected: config.finishReason,
        actual: mockResult.finishReason,
      },
      {
        name: 'inputTokens matches',
        passed: mockResult.usage.inputTokens === config.promptTokens,
        expected: config.promptTokens,
        actual: mockResult.usage.inputTokens,
      },
      {
        name: 'outputTokens matches',
        passed: mockResult.usage.outputTokens === config.completionTokens,
        expected: config.completionTokens,
        actual: mockResult.usage.outputTokens,
      },
    ]

    const allPassed = assertions.every(a => a.passed)

    return Response.json({
      success: true,
      testPassed: allPassed,
      duration,
      result: mockResult,
      assertions,
      note: 'This demo simulates MockLanguageModelV3 behavior. In real tests, use MockLanguageModelV3 from ai/test.',
      codeExample: `import { MockLanguageModelV3 } from 'ai/test'

const mockModel = new MockLanguageModelV3({
  doGenerate: async () => ({
    content: [{ type: 'text', text: '${config.mockText}' }],
    finishReason: '${config.finishReason}',
    usage: {
      inputTokens: { total: ${config.promptTokens} },
      outputTokens: { total: ${config.completionTokens} },
    },
    warnings: [],
  }),
})

const result = await generateText({
  model: mockModel,
  prompt: '${config.testPrompt}',
})`,
    })
  } catch (error) {
    return Response.json({
      success: false,
      testPassed: false,
      error: error instanceof Error ? error.message : 'Test execution failed',
      duration: Date.now() - startTime,
    })
  }
}
