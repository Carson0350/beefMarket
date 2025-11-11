import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import { ComparisonProvider } from '@/contexts/ComparisonContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WagnerBeef - Bull Marketplace',
  description: 'Professional bull breeding marketplace connecting ranchers with breeders',
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
