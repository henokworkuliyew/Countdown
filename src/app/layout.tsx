import type React from 'react'
import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/session-provider'
import MainNavigation from '@/components/main-navigation'
import './globals.css'


export const metadata: Metadata = {
  title: 'BDU CS Graduation Countdown',
  description:
    'Countdown to graduation for Bahirdar University Computer Science students',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider session={session}>
            <div className="min-h-screen flex flex-col">
              <MainNavigation />
              <main className="flex-1">{children}</main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
