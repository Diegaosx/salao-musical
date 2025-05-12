import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InstallPrompt from "@/components/install-prompt"
import Script from "next/script"

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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <InstallPrompt />

        {/* Script para registrar o service worker */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registrado com sucesso:', registration.scope);
                  },
                  function(err) {
                    console.log('Falha ao registrar Service Worker:', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
