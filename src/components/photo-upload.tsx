"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { CldImage } from "next-cloudinary"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PhotoUploadProps {
  value?: string[]
  onChange?: (photos: string[]) => void
  maxFiles?: number
  disabled?: boolean
}

export function PhotoUpload({ 
  value = [], 
  onChange, 
  maxFiles = 10, 
  disabled = false 
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()
    return result.url
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return
    
    setUploading(true)
    setUploadProgress(0)

    try {
      const newPhotos: string[] = []
      
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const url = await uploadToCloudinary(file)
        newPhotos.push(url)
        setUploadProgress(((i + 1) / acceptedFiles.length) * 100)
      }

      const updatedPhotos = [...value, ...newPhotos].slice(0, maxFiles)
      onChange?.(updatedPhotos)
    } catch (error) {
      console.error('Upload error:', error)
      // TODO: Show error toast
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [value, onChange, maxFiles, disabled])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - value.length,
    disabled: disabled || uploading
  })

  const removePhoto = (index: number) => {
    if (disabled) return
    const newPhotos = value.filter((_, i) => i !== index)
    onChange?.(newPhotos)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        {...getRootProps()} 
        className={`
          border-2 border-dashed cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
        `}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-lg font-medium">Uploading photos...</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(uploadProgress)}% complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                {isDragActive ? (
                  <Upload className="h-12 w-12 text-primary" />
                ) : (
                  <Camera className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop photos here' : 'Upload photos'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports JPG, PNG, WebP • Max {maxFiles} photos • {value.length}/{maxFiles} uploaded
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <CldImage
                  src={url}
                  alt={`Photo ${index + 1}`}
                  width={200}
                  height={200}
                  deliveryType="fetch"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {!disabled && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}