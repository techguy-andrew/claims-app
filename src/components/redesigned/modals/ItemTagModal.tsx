'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Search, 
  Plus, 
  Tag, 
  Package, 
  AlertCircle, 
  CheckCircle,
  FileText,
  ArrowLeft
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../forms/Input'
import { Textarea } from '../forms/Textarea'
import { Field } from '../forms/Label'
import { Modal } from '../ui/Modal'
import { ClaimItem, ClaimFile } from '../types/claim.types'
import styles from './ItemTagModal.module.css'

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const newItemSchema = z.object({
  itemName: z.string()
    .min(1, 'Item name is required')
    .max(100, 'Item name must be less than 100 characters'),
  details: z.string()
    .max(1000, 'Details must be less than 1000 characters')
    .optional()
})

type NewItemFormData = z.infer<typeof newItemSchema>

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ItemTagModalProps {
  isOpen: boolean
  onClose: () => void
  file: ClaimFile | null
  items: ClaimItem[]
  onTagFile: (fileId: string, itemId: string | null) => Promise<void>
  onCreateItem: (itemName: string, details?: string) => Promise<ClaimItem>
  loading?: boolean
  className?: string
}

interface ItemOption {
  item: ClaimItem
  isSelected: boolean
  isCurrent: boolean
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ============================================================================
// ITEM OPTION COMPONENT
// ============================================================================

const ItemOption: React.FC<{
  item: ClaimItem
  isSelected: boolean
  isCurrent: boolean
  onSelect: (item: ClaimItem) => void
  disabled?: boolean
}> = ({ item, isSelected, isCurrent, onSelect, disabled = false }) => {
  return (
    <motion.button
      className={`${styles.itemOption} ${isSelected ? styles.selected : ''} ${isCurrent ? styles.current : ''}`}
      onClick={() => onSelect(item)}
      disabled={disabled}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.itemIcon}>
        <Package className={styles.itemIconSvg} />
      </div>
      
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <h4 className={styles.itemName}>{item.itemName}</h4>
          {isCurrent && (
            <div className={styles.currentBadge}>
              <CheckCircle className={styles.currentIcon} />
              <span>Current</span>
            </div>
          )}
        </div>
        
        {item.details && (
          <p className={styles.itemDetails}>{item.details}</p>
        )}
        
        <div className={styles.itemMeta}>
          <span className={styles.fileCount}>
            {item.files?.length || 0} file{item.files?.length !== 1 ? 's' : ''}
          </span>
          <span className={styles.itemDate}>
            Created {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.button>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ItemTagModal: React.FC<ItemTagModalProps> = ({
  isOpen,
  onClose,
  file,
  items,
  onTagFile,
  onCreateItem,
  loading: externalLoading = false,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loading = externalLoading || internalLoading

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
    watch
  } = useForm<NewItemFormData>({
    resolver: zodResolver(newItemSchema),
    defaultValues: {
      itemName: '',
      details: ''
    },
    mode: 'onChange'
  })

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items
    
    const lowerSearch = searchTerm.toLowerCase()
    return items.filter(item =>
      item.itemName.toLowerCase().includes(lowerSearch) ||
      item.details?.toLowerCase().includes(lowerSearch)
    )
  }, [items, searchTerm])

  // Get item options with selection state
  const itemOptions: ItemOption[] = useMemo(() => {
    return filteredItems.map(item => ({
      item,
      isSelected: false,
      isCurrent: file?.item?.id === item.id
    }))
  }, [filteredItems, file?.item?.id])

  // Reset modal state
  const resetModalState = useCallback(() => {
    setSearchTerm('')
    setShowCreateForm(false)
    setError(null)
    setSuccess(null)
    resetForm()
  }, [resetForm])

  // Handle modal close
  const handleClose = useCallback(() => {
    if (!loading) {
      resetModalState()
      onClose()
    }
  }, [loading, resetModalState, onClose])

  // Handle tagging file to item
  const handleTagToItem = useCallback(async (item: ClaimItem | null) => {
    if (!file) return
    
    setInternalLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      await onTagFile(file.id, item?.id || null)
      
      if (item) {
        setSuccess(`File tagged to "${item.itemName}"`)
      } else {
        setSuccess('File untagged successfully')
      }
      
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to tag file')
    } finally {
      setInternalLoading(false)
    }
  }, [file, onTagFile, handleClose])

  // Handle creating new item and tagging
  const handleCreateAndTag = useCallback(async (data: NewItemFormData) => {
    if (!file) return
    
    setInternalLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const newItem = await onCreateItem(
        data.itemName.trim(),
        data.details?.trim() || undefined
      )
      
      await onTagFile(file.id, newItem.id)
      
      setSuccess(`Created "${newItem.itemName}" and tagged file`)
      
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item and tag file')
    } finally {
      setInternalLoading(false)
    }
  }, [file, onCreateItem, onTagFile, handleClose])

  // Handle back to items list
  const handleBackToItems = useCallback(() => {
    setShowCreateForm(false)
    setError(null)
    resetForm()
  }, [resetForm])

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 50,
      transition: { duration: 0.2 }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, x: -20 }
  }

  if (!file) return null

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`${styles.overlay} ${className || ''}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.headerIcon}>
                  <Tag className={styles.headerIconSvg} />
                </div>
                <div className={styles.headerContent}>
                  <h2 className={styles.headerTitle}>
                    {showCreateForm ? 'Create New Item' : 'Tag File to Item'}
                  </h2>
                  <div className={styles.fileInfo}>
                    <FileText className={styles.fileIcon} />
                    <span className={styles.fileName}>{file.fileName}</span>
                    <span className={styles.fileSize}>
                      ({formatFileSize(file.fileSize || 0)})
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.headerRight}>
                {showCreateForm && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleBackToItems}
                    disabled={loading}
                    leftIcon={<ArrowLeft />}
                  />
                )}
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleClose}
                  disabled={loading}
                  leftIcon={<X />}
                />
              </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
              {/* Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className={styles.errorMessage}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className={styles.messageIcon} />
                    <span>{error}</span>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div
                    className={styles.successMessage}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className={styles.messageIcon} />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {!showCreateForm ? (
                  <motion.div
                    key="items-list"
                    className={styles.itemsList}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Current Assignment */}
                    {file.item && (
                      <div className={styles.currentAssignment}>
                        <div className={styles.currentInfo}>
                          <div className={styles.currentLabel}>Currently tagged to:</div>
                          <div className={styles.currentItemName}>{file.item.itemName}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleTagToItem(null)}
                          disabled={loading}
                        >
                          Remove Tag
                        </Button>
                      </div>
                    )}

                    {/* Search */}
                    <div className={styles.searchContainer}>
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search />}
                        className={styles.searchInput}
                      />
                    </div>

                    {/* Items */}
                    <div className={styles.itemsContainer}>
                      {itemOptions.length > 0 ? (
                        <div className={styles.itemsGrid}>
                          <AnimatePresence>
                            {itemOptions.map(({ item, isSelected, isCurrent }) => (
                              <ItemOption
                                key={item.id}
                                item={item}
                                isSelected={isSelected}
                                isCurrent={isCurrent}
                                onSelect={() => handleTagToItem(item)}
                                disabled={loading || isCurrent}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : searchTerm ? (
                        <div className={styles.emptyState}>
                          <Package className={styles.emptyIcon} />
                          <h3 className={styles.emptyTitle}>No items found</h3>
                          <p className={styles.emptyDescription}>
                            No items match "{searchTerm}". Try a different search term.
                          </p>
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          <Package className={styles.emptyIcon} />
                          <h3 className={styles.emptyTitle}>No items available</h3>
                          <p className={styles.emptyDescription}>
                            Create your first item to start organizing files.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Create Button */}
                    <div className={styles.createSection}>
                      <Button
                        variant="primary"
                        onClick={() => setShowCreateForm(true)}
                        disabled={loading}
                        leftIcon={<Plus />}
                        className={styles.createButton}
                      >
                        Create New Item
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="create-form"
                    className={styles.createForm}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form onSubmit={handleSubmit(handleCreateAndTag)} className={styles.form}>
                      <div className={styles.formFields}>
                        <Field
                          label="Item Name"
                          required
                          error={errors.itemName?.message}
                          className={styles.fieldContainer}
                        >
                          <Controller
                            name="itemName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="e.g., Dining Table, Sofa, Laptop..."
                                state={errors.itemName ? 'error' : 'default'}
                                leftIcon={<Package />}
                                autoFocus
                              />
                            )}
                          />
                        </Field>

                        <Field
                          label="Details"
                          error={errors.details?.message}
                          className={styles.fieldContainer}
                        >
                          <Controller
                            name="details"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                placeholder="Optional: Add damage description, notes, or other details..."
                                rows={3}
                                state={errors.details ? 'error' : 'default'}
                                autoResize
                              />
                            )}
                          />
                        </Field>
                      </div>

                      <div className={styles.formActions}>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleBackToItems}
                          disabled={loading}
                        >
                          <ArrowLeft className={styles.buttonIcon} />
                          Back to Items
                        </Button>

                        <Button
                          type="submit"
                          variant="primary"
                          loading={loading}
                          disabled={!isValid || loading}
                        >
                          <Plus className={styles.buttonIcon} />
                          Create & Tag File
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ItemTagModal