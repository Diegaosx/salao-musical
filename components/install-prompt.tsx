"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, X, HelpCircle } from "lucide-react"

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Detectar se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Capturar o evento beforeinstallprompt para navegadores compatíveis
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir o comportamento padrão do Chrome
      e.preventDefault()
      // Armazenar o evento para uso posterior
      setDeferredPrompt(e)
      // Mostrar o botão de instalação
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Verificar se o app já está instalado
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    if (isStandalone) {
      setShowPrompt(false)
    } else {
      // Se não estiver instalado, mostrar o prompt após 3 segundos
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)

      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Se não temos o prompt nativo, redirecionar para a página de instruções
      window.location.href = "/instalar"
      return
    }

    // Mostrar o prompt de instalação
    deferredPrompt.prompt()

    // Aguardar a resposta do usuário
    const { outcome } = await deferredPrompt.userChoice
    console.log(`Usuário ${outcome === "accepted" ? "aceitou" : "recusou"} a instalação`)

    // Limpar o prompt armazenado
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white p-4 shadow-lg border-t z-40">
      <button onClick={() => setShowPrompt(false)} className="absolute top-2 right-2 text-gray-500" aria-label="Fechar">
        <X size={20} />
      </button>
      <div className="flex flex-col items-start">
        <h3 className="font-bold text-[#002060]">Instale o App do Salão Musical</h3>
        <p className="text-sm text-gray-600 mb-3">
          {isIOS
            ? "Adicione à tela inicial para uma experiência completa"
            : "Instale nosso app para uma experiência melhor"}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleInstallClick}
            className="bg-[#002060] text-white px-4 py-2 rounded-md flex items-center"
          >
            <Download size={16} className="mr-2" />
            Instalar App
          </button>

          <Link
            href="/instalar"
            className="text-[#002060] border border-[#002060] px-4 py-2 rounded-md flex items-center"
          >
            <HelpCircle size={16} className="mr-2" />
            Ver instruções
          </Link>
        </div>
      </div>
    </div>
  )
}
