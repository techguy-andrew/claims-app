import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'The Rapid Prototyping Template - 2-Hour MVPs for Agency Developers',
  description: 'Transform client ideas into working demos in hours, not weeks. The ultimate Next.js + shadcn/ui template for software agency solopreneurs.',
  keywords: ['Next.js', 'shadcn/ui', 'Rapid Prototyping', 'Agency Template', 'MVP Development', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Agency Solopreneurs' }],
  creator: 'The Rapid Prototyping Community',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rapid-template.dev',
    title: 'The Rapid Prototyping Template',
    description: 'Transform client ideas into working demos in hours, not weeks.',
    siteName: 'Rapid Prototyping Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Rapid Prototyping Template',
    description: 'Transform client ideas into working demos in hours, not weeks.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}