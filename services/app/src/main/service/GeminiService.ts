import { GoogleGenAI } from '@google/genai'
import { TextRankService } from './TextRankService'

export class GeminiService {
  private genAI: GoogleGenAI | null = null
  private apiKey: string
  private textRankService: TextRankService

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.textRankService = new TextRankService()
  }

  private getClient(): GoogleGenAI {
    if (!this.genAI) {
      if (!this.apiKey) {
        throw new Error('Gemini API key is not configured')
      }
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey })
    }
    return this.genAI
  }

  async *reflectionNoteStream(text: string): AsyncGenerator<string, void> {
    if (!text || text.trim().length === 0) {
      throw new Error('Invalid input text')
    }

    if (!process.env.PROMPT || !process.env.MODEL_NAME) {
      throw new Error('Missing environment variables: PROMPT or MODEL_NAME')
    }

    try {
      const client = this.getClient()
      const textRankResult = this.textRankService.extractKeySentences(text)
      const preprocessedText = textRankResult.processedText
      const systemPrompt = process.env.PROMPT

      const userNote = process.env.PROMPT.replace('{text}', preprocessedText)
      const fullPrompt = `${systemPrompt}\n\n${userNote}`

      const res = await client.models.generateContentStream({
        model: process.env.MODEL_NAME,
        contents: fullPrompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0
          }
        }
      })

      for await (const chunk of res) {
        if (chunk.text) {
          yield chunk.text
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error generating summary:', error)
      throw new Error(`Failed to generate summary: ${errorMessage}`)
    }
  }

  async reflectionNote(text: string): Promise<string> {
    let result = ''
    for await (const chuck of this.reflectionNoteStream(text)) {
      result += chuck
    }
    return result
  }
}
