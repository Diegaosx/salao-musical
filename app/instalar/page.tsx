"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share, Bell } from "lucide-react"

export default function InstalarPage() {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown")

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform("ios")
    } else if (/android/i.test(userAgent)) {
      setPlatform("android")
    } else {
      setPlatform("desktop")
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-[#002060]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para o app
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#002060] mb-6">Instalar o App</h1>

          {platform === "ios" && (
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold mb-3">Como instalar no iOS:</h2>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p>
                        Toque no botão <Share className="h-5 w-5 inline text-gray-600" /> de compartilhamento
                      </p>
                      <div className="mt-2 bg-gray-100 p-3 rounded-md">
                        <Image
                          src="/images/ios-share.png"
                          alt="Botão de compartilhamento no Safari"
                          width={280}
                          height={60}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p>
                        Role para baixo e toque em <span className="font-medium">Adicionar à Tela de Início</span>
                      </p>
                      <div className="mt-2 bg-gray-100 p-3 rounded-md">
                        <Image
                          src="/images/ios-add-home.png"
                          alt="Opção Adicionar à Tela de Início"
                          width={280}
                          height={200}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p>
                        Toque em <span className="font-medium">Adicionar</span> no canto superior direito
                      </p>
                      <div className="mt-2 bg-gray-100 p-3 rounded-md">
                        <Image
                          src="/images/ios-confirm.png"
                          alt="Confirmar adição à tela inicial"
                          width={280}
                          height={180}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Sobre notificações no iOS</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Infelizmente, o iOS não suporta notificações push para aplicativos web no momento. Para receber
                  atualizações, recomendamos verificar o app regularmente.
                </p>
              </div>
            </div>
          )}

          {platform === "android" && (
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold mb-3">Como instalar no Android:</h2>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p>Toque no banner "Adicionar à tela inicial" que aparece automaticamente</p>
                      <p className="text-sm text-gray-600 mt-1">ou</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p>Toque no menu (três pontos) e selecione "Instalar aplicativo"</p>
                      <div className="mt-2 bg-gray-100 p-3 rounded-md">
                        <Image
                          src="/images/android-install.png"
                          alt="Opção Instalar aplicativo no Chrome"
                          width={280}
                          height={180}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p>Toque em "Instalar" para confirmar</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Ativar notificações</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Após instalar o app, toque no botão de sino <Bell className="h-4 w-4 inline text-gray-600" />
                  para ativar as notificações e receber atualizações.
                </p>
              </div>
            </div>
          )}

          {platform === "desktop" && (
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold mb-3">Como instalar no computador:</h2>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p>Clique no ícone de instalação na barra de endereço</p>
                      <div className="mt-2 bg-gray-100 p-3 rounded-md">
                        <Image
                          src="/images/desktop-install.png"
                          alt="Ícone de instalação no Chrome"
                          width={280}
                          height={60}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#002060] text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p>Clique em "Instalar" para confirmar</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="text-center">
                <h3 className="font-semibold mb-2">Ativar notificações</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Após instalar o app, clique no botão de sino para ativar as notificações e receber atualizações.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#002060] text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o app
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
