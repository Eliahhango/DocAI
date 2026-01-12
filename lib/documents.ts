import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx'
import PDFDocument from 'pdfkit'
import PptxGenJS from 'pptxgenjs'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

// Ensure upload directory exists
export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating upload directory:', error)
  }
}

// Generate Word document
export async function generateWordDocument(content: string, filename: string): Promise<string> {
  await ensureUploadDir()

  const paragraphs = content.split('\n\n').map((text, index) => {
    if (text.trim() === '') return null

    // Check if it's a heading (starts with # or is short)
    if (text.startsWith('#') || (text.length < 100 && !text.includes('. '))) {
      const level = text.match(/^#+/)?.[0].length || 1
      return new Paragraph({
        text: text.replace(/^#+\s*/, ''),
        heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
        spacing: { after: 200 },
      })
    }

    return new Paragraph({
      children: text.split('\n').map(line => new TextRun(line)),
      spacing: { after: 200 },
    })
  }).filter(Boolean) as Paragraph[]

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: content })],
      },
    ],
  })

  const filePath = path.join(UPLOAD_DIR, `${filename}.docx`)
  const buffer = await Packer.toBuffer(doc)
  await fs.writeFile(filePath, buffer)

  return filePath
}

// Generate PDF document
export async function generatePDFDocument(content: string, filename: string): Promise<string> {
  await ensureUploadDir()

  const filePath = path.join(UPLOAD_DIR, `${filename}.pdf`)
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const stream = createWriteStream(filePath)
    doc.pipe(stream)

    // Split content into paragraphs
    const paragraphs = content.split('\n\n')
    paragraphs.forEach((para, index) => {
      if (index > 0) doc.moveDown()
      doc.fontSize(12).text(para.trim(), {
        align: 'left',
        width: 500,
      })
    })

    doc.end()

    stream.on('finish', () => resolve(filePath))
    stream.on('error', reject)
  })
}

// Generate PowerPoint presentation
export async function generatePPTXDocument(content: string, filename: string): Promise<string> {
  await ensureUploadDir()

  const pptx = new PptxGenJS()

  // Split content into slides (by double newlines or markdown headings)
  const slides = content.split(/\n(?=#|\n)/).filter(s => s.trim())

  slides.forEach((slideContent, index) => {
    const slide = pptx.addSlide()
    
    // Extract title (first line or heading)
    const lines = slideContent.split('\n')
    const title = lines[0].replace(/^#+\s*/, '').trim() || `Slide ${index + 1}`
    const body = lines.slice(1).join('\n').trim() || slideContent.replace(/^#+\s*.*\n/, '').trim()

    slide.addText(title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 32,
      bold: true,
      color: '363636',
    })

    if (body) {
      const bulletPoints = body.split('\n').filter(line => line.trim())
      bulletPoints.forEach((point, i) => {
        slide.addText(point.replace(/^[-*]\s*/, ''), {
          x: 0.5,
          y: 1.5 + i * 0.8,
          w: 9,
          h: 0.7,
          fontSize: 18,
          bullet: { type: 'number' },
          color: '363636',
        })
      })
    }
  })

  const filePath = path.join(UPLOAD_DIR, `${filename}.pptx`)
  await pptx.writeFile({ fileName: filePath })

  return filePath
}

// Convert Word to PDF (simplified - would use library like libreoffice or pandoc in production)
export async function convertWordToPDF(wordPath: string): Promise<string> {
  // In production, use a library like libreoffice-convert or pandoc
  // For now, we'll read the word doc content and generate a new PDF
  const content = await fs.readFile(wordPath, 'utf-8')
  const pdfPath = wordPath.replace('.docx', '.pdf')
  return generatePDFDocument(content, path.basename(pdfPath, '.pdf'))
}

// Convert PDF to Word (simplified)
export async function convertPDFToWord(pdfPath: string): Promise<string> {
  // In production, use a library like pdf-parse + docx generation
  // For now, placeholder
  const content = 'Converted PDF content' // Would extract text from PDF
  const wordPath = pdfPath.replace('.pdf', '.docx')
  return generateWordDocument(content, path.basename(wordPath, '.docx'))
}
