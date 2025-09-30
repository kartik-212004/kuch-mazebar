import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'smartstudenthub',
  description: 'A centralized digital platform for Higher Education Institutions to record, track, and showcase students’ academic, co-curricular, and extracurricular achievements in one unified profile.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} dark`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
