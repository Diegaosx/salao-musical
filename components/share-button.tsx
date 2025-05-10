"use client"

import { Share } from "lucide-react"
import { useState } from "react"

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: "Salão Musical App",
      text: "Confira o aplicativo do Salão Musical de Lisboa!",
      url: window.location.origin,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      // Fallback para copiar o link
      navigator.clipboard.writeText(window.location.origin)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  return (
    <>
      <button
        onClick={handleShare}
        className="fixed bottom-20 right-4 bg-[#002060] text-white p-3 rounded-full shadow-lg z-50"
        aria-label="Compartilhar aplicativo"
      >
        <Share size={24} />
      </button>

      {showToast && (
        <div className="fixed bottom-28 right-4 bg-black text-white px-4 py-2 rounded-md text-sm z-50 animate-fade-in">
          Link copiado!
        </div>
      )}
    </>
  )
}
