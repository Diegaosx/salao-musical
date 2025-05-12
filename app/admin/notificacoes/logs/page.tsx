"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"

interface NotificationLog {
  notification?: {
    id: string
    title: string
    scheduledFor: string
  }
  results?: Array<{
    success: boolean
    endpoint: string
    error?: string
  }>
  sent?: number
  failed?: number
  error?: boolean
  message?: string
  stack?: string
  timestamp: string
}

export default function NotificacoesLogsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault()
    // Senha simples para demonstração - em produção, use um sistema de autenticação adequado
    if (password === "admin123") {
      setIsAuthenticated(true)
      setError("")
      loadLogs()
    } else {
      setError("Senha incorreta")
    }
  }

  const loadLogs = async () => {
    try {
      setIsLoading(true)

      // Em um ambiente real, você teria um endpoint de API para isso
      // Aqui estamos simulando a leitura de logs
      // Na produção, você deve implementar um endpoint de API adequado

      // Simular carregamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dados de exemplo
      const sampleLogs: NotificationLog[] = [
        {
          notification: {
            id: "1",
            title: "Promoção de Violões",
            scheduledFor: new Date(Date.now() - 3600000).toISOString(),
          },
          results: [
            { success: true, endpoint: "https://fcm.googleapis.com/fcm/send/123" },
            { success: true, endpoint: "https://fcm.googleapis.com/fcm/send/456" },
            { success: false, endpoint: "https://fcm.googleapis.com/fcm/send/789", error: "Subscription expired" },
          ],
          sent: 2,
          failed: 1,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          notification: {
            id: "2",
            title: "Novos Pianos em Estoque",
            scheduledFor: new Date(Date.now() - 7200000).toISOString(),
          },
          results: [
            { success: true, endpoint: "https://fcm.googleapis.com/fcm/send/123" },
            { success: true, endpoint: "https://fcm.googleapis.com/fcm/send/456" },
          ],
          sent: 2,
          failed: 0,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          error: true,
          message: "Erro ao processar notificações",
          stack:
            "Error: Falha na conexão\n    at processNotifications (/app/api/notifications/process-scheduled/route.ts:123:7)",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
        },
      ]

      setLogs(sampleLogs)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar logs")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
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
            <div className="flex items-center">
              <Link href="/admin/notificacoes" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-[#002060]" />
              </Link>
              <h1 className="text-2xl font-bold text-[#002060]">Logs de Notificações</h1>
            </div>
            <button onClick={loadLogs} className="flex items-center text-[#002060] hover:bg-blue-50 p-2 rounded-md">
              <RefreshCw className="h-5 w-5 mr-1" />
              Atualizar
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum log de notificação encontrado.</div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${log.error ? "bg-red-50 border-red-200" : "bg-white"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">{formatDate(log.timestamp)}</span>
                        {log.error ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Erro</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Sucesso</span>
                        )}
                      </div>

                      {log.error ? (
                        <div>
                          <h3 className="font-semibold text-red-700">{log.message}</h3>
                          {log.stack && (
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto text-red-600">
                              {log.stack}
                            </pre>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold">
                            {log.notification?.title || "Processamento de notificações"}
                          </h3>

                          {log.notification && (
                            <p className="text-sm text-gray-600 mt-1">
                              Agendada para: {formatDate(log.notification.scheduledFor)}
                            </p>
                          )}

                          <div className="mt-2 flex space-x-4">
                            <span className="text-sm text-green-600">Enviadas: {log.sent}</span>
                            <span className="text-sm text-red-600">Falhas: {log.failed}</span>
                          </div>

                          {log.results && log.results.length > 0 && (
                            <div className="mt-3">
                              <details className="text-sm">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                  Ver detalhes ({log.results.length} destinatários)
                                </summary>
                                <ul className="mt-2 pl-5 space-y-1 text-xs">
                                  {log.results.map((result, i) => (
                                    <li key={i} className={result.success ? "text-green-600" : "text-red-600"}>
                                      {result.success ? "✓" : "✗"} {result.endpoint.substring(0, 30)}...{" "}
                                      {result.error && `(${result.error})`}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
