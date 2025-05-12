"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Trash2, Edit, ArrowLeft, Send, List } from "lucide-react"
import type { ScheduledNotification } from "@/types/notifications"

export default function NotificacoesAgendadasPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<ScheduledNotification[]>([])
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
      loadNotifications()
    } else {
      setError("Senha incorreta")
    }
  }

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/notifications/scheduled")

      if (!response.ok) {
        throw new Error("Falha ao carregar notificações")
      }

      const data = await response.json()
      setNotifications(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar notificações")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta notificação?")) {
      return
    }

    try {
      const response = await fetch(`/api/notifications/scheduled/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir notificação")
      }

      // Atualizar a lista
      setNotifications(notifications.filter((n) => n.id !== id))
    } catch (err: any) {
      setError(err.message || "Erro ao excluir notificação")
    }
  }

  const handleProcessScheduled = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/notifications/process-scheduled")

      if (!response.ok) {
        throw new Error("Falha ao processar notificações agendadas")
      }

      const result = await response.json()
      alert(`Processamento concluído: ${result.processed} notificação(ões) processada(s)`)

      // Recarregar a lista
      loadNotifications()
    } catch (err: any) {
      setError(err.message || "Erro ao processar notificações agendadas")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
              <Link href="/admin" className="mr-4">
                <ArrowLeft className="h-5 w-5 text-[#002060]" />
              </Link>
              <h1 className="text-2xl font-bold text-[#002060]">Notificações Agendadas</h1>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/admin/notificacoes/logs"
                className="flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                <List className="h-4 w-4 mr-1" />
                Ver Logs
              </Link>
              <button
                onClick={handleProcessScheduled}
                className="flex items-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <Send className="h-4 w-4 mr-1" />
                Processar Agendadas
              </button>
              <Link
                href="/admin/notificacoes/nova"
                className="bg-[#002060] text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors text-sm"
              >
                Nova Notificação
              </Link>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhuma notificação agendada encontrada.</div>
          ) : (
            <div className="space-y-4">
              {notifications
                .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 ${notification.sent ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{notification.body}</p>

                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(notification.scheduledFor)}</span>
                        </div>

                        {notification.url && (
                          <div className="mt-1 text-sm">
                            <span className="text-blue-600">URL: {notification.url}</span>
                          </div>
                        )}

                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              notification.sent ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {notification.sent ? "Enviada" : "Pendente"}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {!notification.sent && (
                          <Link
                            href={`/admin/notificacoes/editar/${notification.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
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
