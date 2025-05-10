"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault()
    // Senha simples para demonstração - em produção, use um sistema de autenticação adequado
    if (password === "admin123") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Senha incorreta")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          url: url || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar notificação")
      }

      setResult(data)
      setTitle("")
      setBody("")
      setUrl("")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao enviar a notificação")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-[#002060]">Painel Administrativo</h1>
          <form onSubmit={handleAuthentication} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#002060] text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#002060]">Painel de Notificações</h1>
            <button onClick={() => router.push("/")} className="text-[#002060] hover:underline text-sm">
              Voltar para o site
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título da Notificação
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo da Notificação
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL de Destino (opcional)
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://www.salaomusical.com/pt/produto/123"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ao clicar na notificação, o usuário será direcionado para esta URL
              </p>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#002060] text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Enviando..." : "Enviar Notificação"}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-[#002060]">Resultado do Envio</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-2">
                <span className="font-medium">Enviadas com sucesso:</span> {result.sent}
              </p>
              <p className="mb-2">
                <span className="font-medium">Falhas no envio:</span> {result.failed}
              </p>
              {result.results && result.results.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Detalhes:</h3>
                  <ul className="text-xs space-y-1">
                    {result.results.map((r: any, i: number) => (
                      <li key={i} className={r.success ? "text-green-600" : "text-red-600"}>
                        {r.success ? "✓" : "✗"} {r.endpoint.substring(0, 30)}... {r.error && `(${r.error})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
