export const APP_NAME = 'New Project'
export const APP_DESCRIPTION = 'A modern web application template'

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const

export const API_ROUTES = {
  WEBHOOKS: '/api/webhooks',
  TRPC: '/api/trpc',
} as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100