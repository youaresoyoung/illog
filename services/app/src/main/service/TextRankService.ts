import { TfIdf, SentenceTokenizer } from 'natural'
import { compareTwoStrings } from 'string-similarity'

interface TextRankResult {
  keySentences: string[]
  sentenceIndices: number[]
  scores: number[]
  processedText: string
}

export class TextRankService {
  private readonly DAMPING_FACTOR = 0.85
  private readonly ITERATIONS = 30
  private readonly MIN_SENTENCE_LENGTH = 10
  private sentenceTokenizer: SentenceTokenizer

  constructor() {
    // @ts-expect-error - SentenceTokenizer is not accurately typed but works without arguments
    this.sentenceTokenizer = new SentenceTokenizer()
  }

  extractKeySentences(text: string, topN?: number): TextRankResult {
    const sentences = this.splitIntoSentences(text)

    if (sentences.length === 0) {
      return {
        keySentences: [],
        sentenceIndices: [],
        scores: [],
        processedText: ''
      }
    }

    if (sentences.length <= 3) {
      return {
        keySentences: sentences,
        sentenceIndices: sentences.map((_, i) => i),
        scores: sentences.map(() => 1.0),
        processedText: sentences.join(' ')
      }
    }

    const tfidf = new TfIdf()
    sentences.forEach((sentence) => tfidf.addDocument(sentence))

    const similarityMatrix = this.buildSimilarityMatrix(sentences)

    const scores = this.textRank(similarityMatrix)

    const numSentences = topN || Math.max(3, Math.ceil(sentences.length * 0.3))
    const rankedIndices = this.getRankedSentenceIndices(scores, numSentences)

    const sortedIndices = rankedIndices.sort((a, b) => a - b)
    const keySentences = sortedIndices.map((i) => sentences[i])
    const keyScores = sortedIndices.map((i) => scores[i])

    return {
      keySentences,
      sentenceIndices: sortedIndices,
      scores: keyScores,
      processedText: keySentences.join(' ')
    }
  }

  private splitIntoSentences(text: string): string[] {
    const rawSentences = this.sentenceTokenizer.tokenize(text)

    if (!rawSentences) {
      return []
    }

    return rawSentences.map((s) => s.trim()).filter((s) => s.length >= this.MIN_SENTENCE_LENGTH)
  }

  private buildSimilarityMatrix(sentences: string[]): number[][] {
    const n = sentences.length
    const matrix: number[][] = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const similarity = compareTwoStrings(sentences[i], sentences[j])
        matrix[i][j] = similarity
        matrix[j][i] = similarity
      }
      matrix[i][i] = 1.0
    }

    return matrix
  }

  private textRank(similarityMatrix: number[][]): number[] {
    const n = similarityMatrix.length
    let scores = Array(n).fill(1.0 / n)

    for (let iter = 0; iter < this.ITERATIONS; iter++) {
      const newScores = Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            const outSum = similarityMatrix[j].reduce((acc, val) => acc + val, 0)
            if (outSum > 0) {
              sum += (similarityMatrix[j][i] / outSum) * scores[j]
            }
          }
        }
        newScores[i] = (1 - this.DAMPING_FACTOR) / n + this.DAMPING_FACTOR * sum
      }

      scores = newScores
    }

    return scores
  }

  private getRankedSentenceIndices(scores: number[], topN: number): number[] {
    const indexed = scores.map((score, index) => ({ score, index }))
    indexed.sort((a, b) => b.score - a.score)
    return indexed.slice(0, topN).map((item) => item.index)
  }

  // NOTE: For debugging - calculate compression ratio
  calculateCompressionRatio(original: string, processed: string): number {
    return processed.length / original.length
  }
}
