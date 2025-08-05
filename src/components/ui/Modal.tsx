"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: 'small' | 'default' | 'large' | 'extraLarge' | 'fullScreen';
  blur?: boolean;
  scrollable?: boolean;
  loading?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  children: React.ReactNode;
}

export interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface ModalTitleProps {
  children: React.ReactNode;
}

export interface ModalDescriptionProps {
  children: React.ReactNode;
}

export interface ModalBodyProps {
  children: React.ReactNode;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right' | 'spaceBetween';
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'default',
  blur = false,
  scrollable = false,
  loading = false,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  children
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  }, [loading, onClose]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.classList.add(styles.noScroll);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove(styles.noScroll);
    };
  }, [open, closeOnEscape, handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted || !open) return null;

  const overlayClasses = [
    styles.overlay,
    blur && styles.blurBackdrop,
    isClosing && styles.closing
  ].filter(Boolean).join(' ');

  const contentClasses = [
    styles.content,
    size !== 'default' && styles[size],
    scrollable && styles.scrollable,
    loading && styles.loading,
    isClosing && styles.closing
  ].filter(Boolean).join(' ');

  return createPortal(
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div className={contentClasses}>
        {children}
      </div>
    </div>,
    document.body
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  onClose, 
  showCloseButton = true 
}) => (
  <div className={styles.header}>
    <div style={{ flex: 1 }}>
      {children}
    </div>
    {showCloseButton && onClose && (
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close modal"
      >
        <svg 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 4L4 12M4 4L12 12" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )}
  </div>
);

const ModalTitle: React.FC<ModalTitleProps> = ({ children }) => (
  <h2 className={styles.title}>{children}</h2>
);

const ModalDescription: React.FC<ModalDescriptionProps> = ({ children }) => (
  <p className={styles.description}>{children}</p>
);

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => (
  <div className={styles.body}>{children}</div>
);

const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  alignment = 'right' 
}) => {
  const footerClasses = [
    styles.footer,
    alignment === 'spaceBetween' && styles.spaceBetween,
    alignment === 'center' && styles.center
  ].filter(Boolean).join(' ');

  return (
    <div className={footerClasses}>
      {children}
    </div>
  );
};

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalTitle.displayName = 'ModalTitle';
ModalDescription.displayName = 'ModalDescription';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';

export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalBody, 
  ModalFooter 
};