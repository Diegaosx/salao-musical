import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InstallPrompt from "@/components/install-prompt"
import IOSInstallBanner from "@/components/ios-install-banner"
import ServiceWorkerRegistration from "@/components/service-worker-registration"

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
      <body className={inter.className}>
        <IOSInstallBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <InstallPrompt />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
