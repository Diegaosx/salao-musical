"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Share } from "lucide-react"

export default function CompartilharPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://app.salaomusical.com"

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        appUrl,
        {
          width: 250,
          margin: 1,
          color: {
            dark: "#002060",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    }
  }, [appUrl])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Salão Musical App",
          text: "Confira o aplicativo do Salão Musical de Lisboa!",
          url: appUrl,
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      // Fallback para copiar o link
      navigator.clipboard.writeText(appUrl)
      alert("Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#002060] mb-6">Compartilhar Aplicativo</h1>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">Escaneie o código QR abaixo para acessar o aplicativo do Salão Musical:</p>
          <div className="flex justify-center mb-2">
            <canvas ref={canvasRef} className="border rounded-lg" />
          </div>
          <p className="text-sm text-gray-500">{appUrl}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center bg-[#002060] text-white py-3 px-4 rounded-md hover:bg-blue-900 transition-colors"
          >
            <Share className="mr-2 h-5 w-5" />
            Compartilhar Link
          </button>

          <div className="text-sm text-gray-600">
            <h2 className="font-semibold mb-2">Como instalar:</h2>
            <ol className="text-left space-y-2 pl-5 list-decimal">
              <li>Acesse o link no seu dispositivo móvel</li>
              <li>No Android: toque no banner "Adicionar à tela inicial"</li>
              <li>No iOS: toque em "Compartilhar" e depois "Adicionar à Tela de Início"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
