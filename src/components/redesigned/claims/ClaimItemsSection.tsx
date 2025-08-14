'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical, 
  AlertCircle, 
  CheckCircle, 
  File, 
  FileText, 
  Download, 
  Tag, 
  ChevronDown,
  ChevronRight,
  Save,
  X,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../forms/Input'
import { Textarea } from '../forms/Textarea'
import { Field } from '../forms/Label'
import { FloatingContextMenu } from '../core/FloatingContextMenu'
import { ClaimItem, ClaimFile } from '../types/claim.types'
import styles from './ClaimItemsSection.module.css'

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const itemFormSchema = z.object({
  itemName: z.string()
    .min(1, 'Item name is required')
    .max(100, 'Item name must be less than 100 characters'),
  details: z.string()
    .max(1000, 'Details must be less than 1000 characters')
    .optional()
})

type ItemFormData = z.infer<typeof itemFormSchema>

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ClaimItemsSectionProps {
  claimId: string
  items: ClaimItem[]
  onItemsChange: (items: ClaimItem[]) => void
  onFileAction?: (action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => void
  loading?: boolean
  className?: string
  showSearch?: boolean
  compact?: boolean
}

interface ItemAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (item: ClaimItem) => void
  variant?: 'default' | 'primary' | 'danger'
  disabled?: boolean
}

// ============================================================================
// ITEM FORM COMPONENT
// ============================================================================

const ItemForm: React.FC<{
  initialData?: Partial<ItemFormData>
  onSubmit: (data: ItemFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isEditing?: boolean
}> = ({ initialData = {}, onSubmit, onCancel, loading = false, isEditing = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      itemName: initialData.itemName || '',
      details: initialData.details || ''
    },
    mode: 'onChange'
  })

  const handleFormSubmit = useCallback(async (data: ItemFormData) => {
    try {
      await onSubmit(data)
      if (!isEditing) {
        reset()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }, [onSubmit, isEditing, reset])

  return (
    <motion.form
      className={styles.itemForm}
      onSubmit={handleSubmit(handleFormSubmit)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
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
                placeholder="Enter item name..."
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
                placeholder="Enter item details..."
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
          onClick={onCancel}
          disabled={loading}
        >
          <X className={styles.buttonIcon} />
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!isValid || loading}
        >
          <Save className={styles.buttonIcon} />
          {isEditing ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </motion.form>
  )
}

// ============================================================================
// ITEM CARD COMPONENT
// ============================================================================

const ItemCard: React.FC<{
  item: ClaimItem
  isExpanded: boolean
  isEditing: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
  onUpdate: (data: ItemFormData) => Promise<void>
  onCancelEdit: () => void
  onFileAction?: (action: 'view' | 'download' | 'tag' | 'delete', file: ClaimFile) => void
  loading?: boolean
}> = ({
  item,
  isExpanded,
  isEditing,
  onToggleExpand,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
  onFileAction,
  loading = false
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null)

  const actions: ItemAction[] = useMemo(() => [
    {
      id: 'edit',
      label: 'Edit Item',
      icon: Edit,
      onClick: onEdit,
      variant: 'primary'
    },
    {
      id: 'delete',
      label: 'Delete Item',
      icon: Trash2,
      onClick: onDelete,
      variant: 'danger'
    }
  ], [onEdit, onDelete])

  const handleActionsClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    
    const top = rect.bottom + 8
    const right = window.innerWidth - rect.right

    setMenuPosition({ top, right })
    setShowActionsMenu(!showActionsMenu)
  }, [showActionsMenu])

  const closeActionsMenu = useCallback(() => {
    setShowActionsMenu(false)
    setMenuPosition(null)
  }, [])

  const handleActionClick = useCallback((action: ItemAction) => {
    action.onClick(item)
    closeActionsMenu()
  }, [item, closeActionsMenu])

  const hasFiles = item.files && item.files.length > 0

  return (
    <motion.div
      className={styles.itemCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      {/* Header */}
      <div 
        className={styles.itemHeader}
        onClick={hasFiles ? onToggleExpand : undefined}
        role={hasFiles ? 'button' : undefined}
        tabIndex={hasFiles ? 0 : undefined}
      >
        <div className={styles.headerLeft}>
          <div className={styles.itemIcon}>
            <Package className={styles.itemIconSvg} />
          </div>
          <div className={styles.itemInfo}>
            <h3 className={styles.itemName}>{item.itemName}</h3>
            <div className={styles.itemMeta}>
              <span className={styles.itemDate}>
                Created {new Date(item.createdAt).toLocaleDateString()}
              </span>
              {hasFiles && (
                <span className={styles.fileCount}>
                  <File className={styles.fileCountIcon} />
                  {item.files.length} file{item.files.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {hasFiles && (
            <motion.div
              className={styles.expandButton}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className={styles.expandIcon} />
            </motion.div>
          )}

          <motion.button
            className={`${styles.actionsButton} menu-button`}
            onClick={handleActionsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="More actions"
          >
            <MoreVertical className={styles.actionsIcon} />
          </motion.button>
        </div>
      </div>

      {/* Details */}
      {item.details && (
        <div className={styles.itemDetails}>
          <p className={styles.itemDetailsText}>{item.details}</p>
        </div>
      )}

      {/* Edit Form */}
      <AnimatePresence>
        {isEditing && (
          <div className={styles.editFormContainer}>
            <ItemForm
              initialData={{ itemName: item.itemName, details: item.details || '' }}
              onSubmit={onUpdate}
              onCancel={onCancelEdit}
              loading={loading}
              isEditing={true}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Files Section */}
      <AnimatePresence>
        {isExpanded && hasFiles && (
          <motion.div
            className={styles.filesSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.filesSectionHeader}>
              <h4 className={styles.filesSectionTitle}>
                Attached Files ({item.files.length})
              </h4>
            </div>
            <div className={styles.filesList}>
              {item.files.map((file) => (
                <motion.div
                  key={file.id}
                  className={styles.fileItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.fileIcon}>
                    {file.fileType === 'image' ? (
                      <img
                        src={file.fileUrl}
                        alt={file.fileName}
                        className={styles.fileImage}
                      />
                    ) : file.fileType === 'pdf' ? (
                      <FileText className={styles.fileIconSvg} />
                    ) : (
                      <File className={styles.fileIconSvg} />
                    )}
                  </div>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.fileName}</span>
                    <span className={styles.fileSize}>
                      {file.fileSize ? `${Math.round(file.fileSize / 1024)} KB` : 'Unknown size'}
                    </span>
                  </div>
                  <div className={styles.fileActions}>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onFileAction?.('view', file)}
                      leftIcon={<Eye />}
                    />
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onFileAction?.('download', file)}
                      leftIcon={<Download />}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions Menu */}
      <FloatingContextMenu
        isVisible={showActionsMenu}
        position={menuPosition}
        onClose={closeActionsMenu}
      >
        <div className={styles.actionsMenu}>
          {actions.map((action) => (
            <motion.button
              key={action.id}
              className={`${styles.actionItem} ${
                action.variant === 'danger' ? styles.actionDanger :
                action.variant === 'primary' ? styles.actionPrimary : ''
              }`}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <action.icon className={styles.actionIcon} />
              <span className={styles.actionLabel}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </FloatingContextMenu>
    </motion.div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ClaimItemsSection: React.FC<ClaimItemsSectionProps> = ({
  claimId,
  items,
  onItemsChange,
  onFileAction,
  loading = false,
  className,
  showSearch = true,
  compact = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState<string | null>(null)

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items
    const query = searchQuery.toLowerCase()
    return items.filter(item => 
      item.itemName.toLowerCase().includes(query) ||
      item.details?.toLowerCase().includes(query)
    )
  }, [items, searchQuery])

  // Handle add item
  const handleAddItem = useCallback(async (data: ItemFormData) => {
    setSubmitting('add')
    try {
      const response = await fetch(`/api/claims/${claimId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to add item')

      const newItem = await response.json()
      onItemsChange([...items, newItem])
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setSubmitting(null)
    }
  }, [claimId, items, onItemsChange])

  // Handle update item
  const handleUpdateItem = useCallback(async (itemId: string, data: ItemFormData) => {
    setSubmitting(itemId)
    try {
      const response = await fetch(`/api/claims/${claimId}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to update item')

      const updatedItem = await response.json()
      onItemsChange(items.map(item => item.id === itemId ? updatedItem : item))
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setSubmitting(null)
    }
  }, [claimId, items, onItemsChange])

  // Handle delete item
  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setSubmitting(itemId)
    try {
      const response = await fetch(`/api/claims/${claimId}/items/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete item')

      onItemsChange(items.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setSubmitting(null)
    }
  }, [claimId, items, onItemsChange])

  const containerClasses = [
    styles.claimItemsSection,
    compact && styles.compact,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h2 className={styles.sectionTitle}>
              Claim Items ({filteredItems.length})
            </h2>
            <p className={styles.sectionDescription}>
              Manage items and documentation for this claim
            </p>
          </div>
          <div className={styles.headerRight}>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              leftIcon={<Plus />}
              disabled={loading || showAddForm}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Search */}
        {showSearch && items.length > 0 && (
          <div className={styles.searchContainer}>
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search />}
              className={styles.searchInput}
            />
          </div>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className={styles.addFormContainer}>
            <ItemForm
              onSubmit={handleAddItem}
              onCancel={() => setShowAddForm(false)}
              loading={submitting === 'add'}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className={styles.itemsList}>
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isExpanded={expandedItem === item.id}
                isEditing={editingItem === item.id}
                onToggleExpand={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                onEdit={() => setEditingItem(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
                onUpdate={(data) => handleUpdateItem(item.id, data)}
                onCancelEdit={() => setEditingItem(null)}
                onFileAction={onFileAction}
                loading={submitting === item.id}
              />
            ))
          ) : (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.emptyStateIcon}>
                <Package className={styles.emptyStateIconSvg} />
              </div>
              <h3 className={styles.emptyStateTitle}>
                {searchQuery ? 'No items found' : 'No items yet'}
              </h3>
              <p className={styles.emptyStateDescription}>
                {searchQuery 
                  ? `No items match "${searchQuery}". Try a different search term.`
                  : 'Add items to organize and track claim documentation.'
                }
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  onClick={() => setShowAddForm(true)}
                  leftIcon={<Plus />}
                  disabled={showAddForm}
                >
                  Add First Item
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ClaimItemsSection