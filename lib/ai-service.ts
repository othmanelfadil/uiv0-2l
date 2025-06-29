// AI service integration for chat, exam generation, and flashcard creation

export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ExamGenerationRequest {
  content: string
  settings: {
    questions: number
    difficulty: string
    timeLimit: number
    questionTypes: string[]
  }
}

export interface FlashcardGenerationRequest {
  content: string
  settings: {
    cardsCount: number
    difficulty?: string
  }
}

export class AIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ""
    this.baseUrl = "https://api.openai.com/v1"
  }

  async generateChatResponse(messages: AIMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("AI chat generation failed:", error)
      throw new Error("Failed to generate AI response")
    }
  }

  async generateExam(request: ExamGenerationRequest): Promise<any> {
    try {
      const prompt = `Generate an exam with ${request.settings.questions} questions based on the following content. 
      Difficulty: ${request.settings.difficulty}
      Question types: ${request.settings.questionTypes.join(", ")}
      Time limit: ${request.settings.timeLimit} minutes
      
      Content: ${request.content}
      
      Return a JSON object with title, description, and questions array.`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      })

      const data = await response.json()
      return JSON.parse(data.choices[0].message.content)
    } catch (error) {
      console.error("Exam generation failed:", error)
      throw new Error("Failed to generate exam")
    }
  }

  async generateFlashcards(request: FlashcardGenerationRequest): Promise<any> {
    try {
      const prompt = `Generate ${request.settings.cardsCount} flashcards based on the following content.
      ${request.settings.difficulty ? `Difficulty: ${request.settings.difficulty}` : ""}
      
      Content: ${request.content}
      
      Return a JSON object with title, description, and cards array (each card has front and back).`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      })

      const data = await response.json()
      return JSON.parse(data.choices[0].message.content)
    } catch (error) {
      console.error("Flashcard generation failed:", error)
      throw new Error("Failed to generate flashcards")
    }
  }

  async extractTextFromDocument(fileBuffer: Buffer, mimeType: string): Promise<string> {
    // Implement document text extraction
    // You might use libraries like pdf-parse, mammoth, etc.
    // Or integrate with services like AWS Textract, Google Document AI

    if (mimeType === "application/pdf") {
      // Use pdf-parse or similar
      return "Extracted PDF text..."
    } else if (mimeType.includes("word")) {
      // Use mammoth or similar
      return "Extracted Word document text..."
    }

    return "Text extraction not supported for this file type"
  }

  async summarizeContent(content: string): Promise<string> {
    try {
      const prompt = `Summarize the following content in 2-3 sentences:
      
      ${content}`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 200,
        }),
      })

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("Content summarization failed:", error)
      throw new Error("Failed to summarize content")
    }
  }
}

export const aiService = new AIService()
