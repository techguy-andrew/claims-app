// ============================================================================
// UPLOAD COMPONENTS EXPORT - React Dropzone + Cloudinary + Framer Motion
// Advanced file upload with glass morphism and modern UX patterns
// ============================================================================

// Upload components - completely redesigned
export { PhotoUpload } from './PhotoUpload'
export { PhotoViewer } from './PhotoViewer'

// Type exports
export type { 
  PhotoFile,
  PhotoUploadProps
} from './PhotoUpload'

export type {
  PhotoViewerProps
} from './PhotoViewer'

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
## PhotoUpload Usage

```tsx
import { PhotoUpload, PhotoFile } from '@/components/redesigned/upload'

function ImageUploadPage() {
  const [photos, setPhotos] = useState<PhotoFile[]>([])

  return (
    <PhotoUpload
      photos={photos}
      onPhotosChange={setPhotos}
      maxFiles={10}
      maxFileSize={10 * 1024 * 1024} // 10MB
      cloudinaryFolder="claims/photos"
      onUploadComplete={(photo) => {
        console.log('Upload completed:', photo)
      }}
      onUploadError={(error, file) => {
        console.error('Upload failed:', error, file)
      }}
    />
  )
}
```

## PhotoViewer Usage

```tsx
import { PhotoViewer, PhotoFile } from '@/components/redesigned/upload'

function PhotoGallery({ photos }: { photos: PhotoFile[] }) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.name}
            onClick={() => setViewerIndex(index)}
            className="cursor-pointer rounded-lg"
          />
        ))}
      </div>

      <PhotoViewer
        photos={photos}
        initialIndex={viewerIndex || 0}
        isOpen={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
        showControls={true}
        showThumbnails={true}
        showInfo={false}
      />
    </>
  )
}
```

## Advanced Features

- **React Dropzone Integration** - Drag & drop with file validation
- **Cloudinary Upload** - Optimized media storage and transformation
- **Real-time Progress** - Upload progress indicators with Framer Motion
- **Advanced Photo Viewer** - Zoom, rotate, fullscreen, keyboard navigation
- **Glass Morphism Design** - Backdrop blur effects and modern styling
- **Mobile-First Responsive** - Touch-optimized with 44px targets
- **Accessibility Optimized** - Full keyboard navigation and screen reader support
- **TypeScript 5 Strict** - Advanced interfaces with runtime safety
- **Error Handling** - Comprehensive upload error states and retry logic
- **Performance Optimized** - Lazy loading, image compression, efficient re-renders

## Architecture Compliance

- **React 18.3.1** functional components with concurrent features
- **CSS Modules** for component-scoped styling
- **React Dropzone 14.2.9** for advanced file handling
- **Framer Motion** for production-grade animations
- **Cloudinary 2.7.0** for scalable media management
- **Advanced TypeScript interfaces** for type safety
- **SSR-safe hooks** for Next.js 15.2.3 compatibility
- **Mobile-first responsive** design patterns
- **Serverless-optimized** for Vercel deployment

## Performance Features

- **Optimistic Updates** - Immediate UI feedback before server confirmation
- **Blob URLs** - Instant preview generation for uploaded files
- **Memory Management** - Automatic cleanup of temporary URLs
- **Lazy Loading** - Efficient image loading with intersection observer
- **Connection Pooling** - Reused upload connections for better performance
- **Error Recovery** - Automatic retry logic with exponential backoff
*/