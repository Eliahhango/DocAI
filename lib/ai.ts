import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDocument(type: 'word' | 'pdf' | 'ppt', prompt: string, context?: string) {
  const systemPrompt = getSystemPrompt(type, context)
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function rewriteDocument(content: string, instructions: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a professional document editor. Rewrite and enhance documents based on user instructions while maintaining the original intent and key information.',
      },
      {
        role: 'user',
        content: `Rewrite this document: ${content}\n\nInstructions: ${instructions}`,
      },
    ],
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function summarizeDocument(content: string, format: 'text' | 'slides' = 'text') {
  const systemPrompt = format === 'slides'
    ? 'You are a professional presentation creator. Create a concise slide outline from the document content. Format as bullet points suitable for PowerPoint slides.'
    : 'You are a professional summarizer. Create a concise summary of the document while preserving key information.'

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Summarize this document:\n\n${content}` },
    ],
    temperature: 0.5,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function translateDocument(content: string, targetLanguage: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the document to ${targetLanguage} while maintaining the original format, style, and meaning.`,
      },
      { role: 'user', content: `Translate this document:\n\n${content}` },
    ],
    temperature: 0.3,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function checkGrammar(content: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a professional grammar and style checker. Identify errors and suggest improvements. Format as JSON with errors array containing position, type, original, and suggestion.',
      },
      { role: 'user', content: `Check grammar and style:\n\n${content}` },
    ],
    temperature: 0.2,
  })

  return completion.choices[0]?.message?.content || ''
}

function getSystemPrompt(type: 'word' | 'pdf' | 'ppt', context?: string): string {
  const basePrompt = context
    ? `You are a professional document creator. Create a ${type.toUpperCase()} document based on the user's request. Use this context: ${context}`
    : `You are a professional document creator. Create a well-structured ${type.toUpperCase()} document based on the user's request.`

  if (type === 'word') {
    return `${basePrompt} Format the content with proper headings, paragraphs, and structure suitable for a Word document.`
  } else if (type === 'ppt') {
    return `${basePrompt} Create slide content with titles and bullet points suitable for a PowerPoint presentation.`
  } else {
    return `${basePrompt} Format the content with proper structure suitable for a PDF document.`
  }
}
