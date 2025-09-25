import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/active-components/toaster'
import { Navigation } from '@/components/active-components/Navigation'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Claims App',
  description: 'Streamlined claims management and processing application.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full w-full">
      <body className={`${inter.variable} font-sans antialiased h-full w-full`}>
        <Navigation>
          {children}
        </Navigation>
        <Toaster />
      </body>
    </html>
  )
}