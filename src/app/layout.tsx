import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import MainNavigation from "@/components/main-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CS Graduation Countdown 2025",
  description: "Celebrate the journey to graduation with Bahirdar University Computer Science Class of 2025",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider>
            <MainNavigation/>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
