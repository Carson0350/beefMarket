import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import { ComparisonProvider } from '@/contexts/ComparisonContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BeefStore - Premium Bull Semen Marketplace',
  description: 'Browse and purchase premium bull semen from top ranches',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ComparisonProvider>{children}</ComparisonProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
