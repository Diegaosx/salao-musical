"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { NotificationFormData } from "@/types/notifications"

export default function NovaNotificacaoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    body: "",
    url: "",
    scheduledDate: "",
    scheduledTime: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      setIsLoading(true)

      // Validar os campos obrigatórios
      if (!formData.title || !formData.body || !formData.scheduledDate || !formData.scheduledTime) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      // Combinar data e hora
      const scheduledFor = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`)

      // Verificar se a data é válida e está no futuro
      if (isNaN(scheduledFor.getTime())) {
        throw new Error("Data ou hora inválida")
      }

      if (scheduledFor <= new Date()) {
        throw new Error("A data de agendamento deve ser no futuro")
      }

      const response = await fetch("/api/notifications/scheduled", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          url: formData.url || undefined,
          scheduledFor: scheduledFor.toISOString(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao criar notificação agendada")
      }

      // Redirecionar para a lista de notificações
      router.push("/admin/notificacoes")
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao criar a notificação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <Link href="/admin/notificacoes" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-[#002060]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#002060]">Nova Notificação Agendada</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título da Notificação *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo da Notificação *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
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
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://www.salaomusical.com/pt/produto/123"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ao clicar na notificação, o usuário será direcionado para esta URL
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Envio *
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Envio *
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Link
                href="/admin/notificacoes"
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors mr-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#002060] text-white py-2 px-4 rounded-md hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
