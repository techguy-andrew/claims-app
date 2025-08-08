import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pdf/[fileId] - Proxy PDF for react-pdf viewer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params

    // Get file information from database
    const file = await prisma.claimFile.findUnique({
      where: { id: fileId },
      select: {
        fileName: true,
        fileUrl: true,
        fileType: true,
        mimeType: true,
      }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Only serve PDFs through this endpoint
    if (file.fileType !== 'pdf') {
      return NextResponse.json(
        { error: 'File is not a PDF' },
        { status: 400 }
      )
    }

    try {
      // Fetch the PDF from Cloudinary
      const response = await fetch(file.fileUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`)
      }

      // Get the PDF content as buffer
      const pdfBuffer = await response.arrayBuffer()
      
      // Return the PDF with proper headers for PDF.js
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Range',
          'Accept-Ranges': 'bytes',
        },
      })

    } catch (fetchError) {
      console.error('Error fetching PDF from Cloudinary:', fetchError)
      return NextResponse.json(
        { error: 'Failed to load PDF' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in PDF proxy endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to serve PDF' },
      { status: 500 }
    )
  }
}