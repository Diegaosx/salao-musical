"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function AbrirArquivoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o navegador suporta a API File Handler
    if (!("launchQueue" in window && "files" in LaunchParams.prototype)) {
      setError("Seu navegador não suporta a abertura de arquivos diretamente.")
      return
    }

    // @ts-ignore - A tipagem do TypeScript não inclui launchQueue ainda
    window.launchQueue.setConsumer((launchParams) => {
      if (!launchParams.files.length) {
        setError("Nenhum arquivo foi fornecido.")
        return
      }

      // Pegar o primeiro arquivo
      const fileHandle = launchParams.files[0]

      // Obter o arquivo
      fileHandle
        .getFile()
        .then((file: File) => {
          setFile(file)

          // Criar URL para o arquivo
          const url = URL.createObjectURL(file)
          setFileUrl(url)
        })
        .catch((err: Error) => {
          setError(`Erro ao abrir o arquivo: ${err.message}`)
        })
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-[#002060]">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar para o app
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#002060] mb-6">Abrir Arquivo</h1>

          {error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          ) : !file ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aguardando arquivo...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="font-semibold text-lg mb-2">{file.name}</h2>
                <p className="text-sm text-gray-600">Tipo: {file.type}</p>
                <p className="text-sm text-gray-600">Tamanho: {(file.size / 1024).toFixed(2)} KB</p>
              </div>

              {fileUrl && file.type === "application/pdf" && (
                <div className="border rounded-md overflow-hidden h-96">
                  <iframe src={fileUrl} className="w-full h-full" title={file.name} />
                </div>
              )}

              {fileUrl && (
                <div className="flex justify-center">
                  <a
                    href={fileUrl}
                    download={file.name}
                    className="flex items-center bg-[#002060] text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Baixar Arquivo
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
