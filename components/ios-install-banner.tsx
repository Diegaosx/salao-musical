"use client"

import { useState, useEffect } from "react"
import { Share, X } from "lucide-react"
import Image from "next/image"

export default function IOSInstallBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [hasDismissed, setHasDismissed] = useState(false)

  useEffect(() => {
    // Verificar se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Verificar se já está instalado como PWA
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true
    setIsStandalone(isInStandaloneMode)

    // Verificar se o usuário já fechou o banner antes
    const dismissed = localStorage.getItem("ios-install-banner-dismissed")
    setHasDismissed(!!dismissed)

    // Mostrar o banner após 2 segundos se for iOS, não estiver em modo standalone e não tiver sido fechado
    if (isIOSDevice && !isInStandaloneMode && !dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Guardar a preferência por 24 horas
    localStorage.setItem("ios-install-banner-dismissed", Date.now().toString())
    setHasDismissed(true)
  }

  // Não mostrar se não for iOS, já estiver instalado ou já tiver sido fechado
  if (!isIOS || isStandalone || !isVisible) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 animate-slide-down">
      <div className="p-4 max-w-md mx-auto">
        <button onClick={handleDismiss} className="absolute top-2 right-2 text-gray-500" aria-label="Fechar">
          <X size={20} />
        </button>

        <div className="flex items-center">
          <div className="mr-3 flex-shrink-0">
            <Image src="/icons/icon-192x192.png" alt="Ícone do app" width={48} height={48} className="rounded-xl" />
          </div>

          <div>
            <h3 className="font-bold text-[#002060]">Instale o App</h3>
            <p className="text-xs text-gray-600">
              Toque em <Share className="h-3 w-3 inline" /> e depois em "Adicionar à Tela de Início"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
