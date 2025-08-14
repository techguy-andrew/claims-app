// ============================================================================
// CLAIM TYPES - Moved from claim-items-section.tsx for clean architecture
// ============================================================================

export interface ClaimItem {
  id: string
  itemName: string
  details: string | null
  createdAt: string
  updatedAt: string
  files: ClaimFile[]
}

export interface ClaimFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  uploadedAt: string
  item?: {
    id: string
    itemName: string
  } | null
}