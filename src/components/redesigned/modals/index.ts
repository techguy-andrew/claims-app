// ============================================================================
// MODALS COMPONENTS EXPORT - Unified modal system with AnimatePresence
// Advanced modal components with glass morphism and Framer Motion
// ============================================================================

// Modal components - completely redesigned
export { ItemTagModal } from './ItemTagModal'
export { ImageModal } from './ImageModal'
export { PDFModal } from './PDFModal'

// Type exports
export type { ItemTagModalProps } from './ItemTagModal'
export type { ImageModalProps } from './ImageModal'
export type { PDFModalProps } from './PDFModal'

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
## ItemTagModal Usage

```tsx
import { ItemTagModal } from '@/components/redesigned/modals'

function FileManagement() {
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ClaimFile | null>(null)

  const handleTagFile = async (fileId: string, itemId: string | null) => {
    const response = await fetch(`/api/files/${fileId}/tag`, {
      method: 'PUT',
      body: JSON.stringify({ itemId })
    })
    // Handle response
  }

  const handleCreateItem = async (itemName: string, details?: string) => {
    const response = await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify({ itemName, details })
    })
    return response.json()
  }

  return (
    <ItemTagModal
      isOpen={tagModalOpen}
      onClose={() => setTagModalOpen(false)}
      file={selectedFile}
      items={items}
      onTagFile={handleTagFile}
      onCreateItem={handleCreateItem}
    />
  )
}
```

## ImageModal Usage

```tsx
import { ImageModal } from '@/components/redesigned/modals'

function ImageGallery() {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ClaimFile | null>(null)

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.fileUrl}
            alt={image.fileName}
            onClick={() => {
              setSelectedImage(image)
              setImageModalOpen(true)
            }}
            className="cursor-pointer rounded-lg hover:opacity-80"
          />
        ))}
      </div>

      <ImageModal
        file={selectedImage}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        showControls={true}
        showInfo={false}
        allowDownload={true}
        onShare={(file) => {
          navigator.share({
            title: file.fileName,
            url: file.fileUrl
          })
        }}
      />
    </>
  )
}
```

## PDFModal Usage

```tsx
import { PDFModal } from '@/components/redesigned/modals'

function DocumentViewer() {
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [selectedPDF, setSelectedPDF] = useState<ClaimFile | null>(null)

  return (
    <>
      <div className="document-list">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="document-item cursor-pointer"
            onClick={() => {
              setSelectedPDF(pdf)
              setPdfModalOpen(true)
            }}
          >
            <FileText className="w-6 h-6" />
            <span>{pdf.fileName}</span>
          </div>
        ))}
      </div>

      <PDFModal
        file={selectedPDF}
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        showControls={true}
        showInfo={true}
        allowDownload={true}
      />
    </>
  )
}
```

## Advanced Features

- **Framer Motion Animations** - Smooth enter/exit animations with AnimatePresence
- **Glass Morphism Design** - Backdrop blur effects and translucent backgrounds
- **Advanced Keyboard Navigation** - Full keyboard control with standard shortcuts
- **Fullscreen Support** - Native fullscreen API integration
- **Mobile-First Responsive** - Touch-optimized with gesture support
- **Accessibility Optimized** - Screen reader support and focus management
- **TypeScript 5 Strict** - Advanced interfaces with runtime safety
- **SSR-Safe Hooks** - Compatible with Next.js 15.2.3 server rendering
- **Performance Optimized** - Lazy loading, efficient re-renders, memory management
- **Error Handling** - Comprehensive error states with retry functionality

## Architecture Compliance

- **React 18.3.1** functional components with concurrent features
- **CSS Modules** for component-scoped styling
- **Framer Motion** for production-grade animations
- **Advanced TypeScript interfaces** for type safety
- **useIsomorphicLayoutEffect** for SSR compatibility
- **Mobile-first responsive** design patterns
- **Serverless-optimized** for Vercel deployment

## Modal System Features

- **Unified API** - Consistent interface across all modal types
- **Body Scroll Lock** - Prevents background scrolling when modal is open
- **Click Outside to Close** - Intuitive interaction patterns
- **Escape Key Support** - Standard keyboard navigation
- **Focus Trap** - Proper focus management for accessibility
- **Portal Rendering** - Rendered outside normal DOM hierarchy
- **Stacking Context** - Proper z-index management for nested modals

## Performance Features

- **Lazy Rendering** - Modals only render when open
- **Memory Management** - Automatic cleanup of event listeners
- **Image Optimization** - Efficient loading and caching strategies
- **PDF Streaming** - Progressive loading for large documents
- **Animation Optimization** - Hardware-accelerated transforms
- **Bundle Splitting** - Code splitting for optimal loading
*/