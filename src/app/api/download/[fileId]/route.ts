import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/download/[fileId] - Download file securely
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
        fileSize: true,
      }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    try {
      // Fetch the file from Cloudinary
      const response = await fetch(file.fileUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`)
      }

      // Get the file content as buffer
      const fileBuffer = await response.arrayBuffer()
      
      // Create proper filename with extension
      let fileName = file.fileName
      if (file.fileType === 'pdf' && !fileName.toLowerCase().endsWith('.pdf')) {
        fileName = `${fileName}.pdf`
      }

      // Return the file with proper headers for download
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': file.mimeType || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': fileBuffer.byteLength.toString(),
          'Cache-Control': 'no-cache',
        },
      })

    } catch (fetchError) {
      console.error('Error fetching file from Cloudinary:', fetchError)
      
      // Fallback: redirect to the Cloudinary URL with proper headers
      return NextResponse.redirect(file.fileUrl, {
        status: 302,
        headers: {
          'Content-Disposition': `attachment; filename="${file.fileName}"`,
        },
      })
    }

  } catch (error) {
    console.error('Error in download endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}