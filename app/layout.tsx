import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Salão Musical de Lisboa",
  description: "Loja de instrumentos musicais desde 1958",
  manifest: "/manifest.json",
  themeColor: "#002060",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Salão Musical",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
