"use client"

import { useEffect, useState } from "react"
import NotificationButton from "@/components/notification-button"
import InstallPrompt from "@/components/install-prompt"
import LoadingScreen from "@/components/loading-screen"
import ShareButton from "@/components/share-button"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular um tempo de carregamento para mostrar a tela de loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex flex-col h-screen w-screen relative">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <iframe
            src="https://www.salaomusical.com/pt/"
            className="flex-grow w-full h-full border-none"
            title="Salão Musical de Lisboa"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            loading="eager"
          />
          <NotificationButton />
          <ShareButton />
          <InstallPrompt />
        </>
      )}
    </main>
  )
}
