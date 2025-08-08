import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// POST /api/upload - Upload file to Cloudinary with optional claim context
export async function POST(request: NextRequest) {
  let file: File | null = null
  let fileType = 'document'
  
  try {
    const body = await request.formData()
    file = body.get('file') as File
    const claimId = body.get('claimId') as string
    const itemId = body.get('itemId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Determine file type for database
    fileType = 'document'
    if (file.type.startsWith('image/')) {
      fileType = 'image'
    } else if (
      file.type === 'application/pdf' || 
      file.type === 'application/x-pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    ) {
      fileType = 'pdf'
    }

    // Determine Cloudinary resource type and upload options
    let resourceType: 'auto' | 'raw' | 'image' = 'auto'
    const uploadOptions: Record<string, unknown> = {
      folder: 'claims-app'
    }

    if (fileType === 'image') {
      resourceType = 'image'
      uploadOptions.transformation = [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    } else {
      // PDFs and documents need raw resource type
      resourceType = 'raw'
    }

    uploadOptions.resource_type = resourceType

    console.log('Attempting to upload to Cloudinary...', {
      fileName: file.name,
      fileSize: file.size,
      fileType,
      mimeType: file.type,
      resourceType,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    })

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, uploadOptions)

    console.log('Cloudinary upload successful:', result.secure_url)

    const uploadResult = {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      fileName: file.name,
      fileType,
      mimeType: file.type,
      fileSize: file.size
    }

    // If claimId is provided, also save to database
    if (claimId) {
      try {
        // Import prisma here to avoid circular dependency issues
        const { prisma } = await import('@/lib/prisma')
        
        const fileRecord = await prisma.claimFile.create({
          data: {
            claimId,
            itemId: itemId || null,
            fileName: file.name,
            fileUrl: result.secure_url,
            fileType,
            fileSize: file.size,
            mimeType: file.type
          },
          include: {
            item: {
              select: { id: true, itemName: true }
            }
          }
        })

        return NextResponse.json({
          ...uploadResult,
          fileRecord
        })
      } catch (dbError) {
        console.error('Error saving file to database:', dbError)
        // Still return the upload result even if database save fails
        return NextResponse.json({
          ...uploadResult,
          warning: 'File uploaded but not saved to claim database'
        })
      }
    }

    return NextResponse.json(uploadResult)
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    
    // More specific error details
    let errorMessage = 'Failed to upload file'
    let errorDetails = {}
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3) // First 3 lines of stack trace
      }
      
      // PDF-specific error handling
      if (fileType === 'pdf') {
        if (errorMessage.includes('file size too large') || errorMessage.includes('timeout')) {
          errorMessage = 'PDF file is too large or took too long to upload. Try a smaller PDF (under 10MB).'
        } else if (errorMessage.includes('invalid file format') || errorMessage.includes('unsupported')) {
          errorMessage = 'PDF file format is not supported. Please ensure it\'s a valid PDF file.'
        } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
          errorMessage = 'Upload limit reached. PDF uploads require more resources than images.'
        }
      }
    }
    
    console.error('Upload error details:', {
      ...errorDetails,
      fileType,
      fileName: file?.name,
      fileSize: file?.size
    })
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        cloudinaryConfig: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          hasApiKey: !!process.env.CLOUDINARY_API_KEY,
          hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
        }
      },
      { status: 500 }
    )
  }
}