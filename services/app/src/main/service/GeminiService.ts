import { GoogleGenAI } from '@google/genai'
import { TextRankService } from './TextRankService'

export class GeminiService {
  private genAI: GoogleGenAI
  private textRankService: TextRankService

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey })
    this.textRankService = new TextRankService()
  }

  async reflectionNote(text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      throw new Error('Invalid input text')
    }

    if (!this.genAI) {
      throw new Error('GeminiService not initialized')
    }

    if (!process.env.PROMPT || !process.env.MODEL_NAME) {
      throw new Error('Missing environment variables: PROMPT or MODEL_NAME')
    }

    try {
      const textRankResult = this.textRankService.extractKeySentences(text)
      const preprocessedText = textRankResult.processedText
      const systemPrompt = process.env.PROMPT

      const userNote = process.env.PROMPT.replace('{text}', preprocessedText)
      const fullPrompt = `${systemPrompt}\n\n${userNote}`

      const res = await this.genAI.models.generateContentStream({
        model: process.env.MODEL_NAME,
        contents: fullPrompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      })

      let result = ''
      for await (const chunk of res) {
        result += chunk.text
      }

      return result
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error generating summary:', error)
      throw new Error(`Failed to generate summary: ${errorMessage}`)
    }
  }
}
