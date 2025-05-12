import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { ScheduledNotification } from "@/types/notifications"

// Em um ambiente de produção, você usaria um banco de dados
const DATA_FILE = path.join(process.cwd(), "data", "scheduled-notifications.json")

// Carregar notificações agendadas
const loadScheduledNotifications = (): ScheduledNotification[] => {
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }

  const data = fs.readFileSync(DATA_FILE, "utf8")
  return JSON.parse(data)
}

// Salvar notificações agendadas
const saveScheduledNotifications = (notifications: ScheduledNotification[]) => {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2), "utf8")
}

// Obter uma notificação agendada específica
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const notifications = loadScheduledNotifications()
    const notification = notifications.find((n) => n.id === params.id)

    if (!notification) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Erro ao carregar notificação agendada:", error)
    return NextResponse.json({ error: "Falha ao carregar notificação agendada" }, { status: 500 })
  }
}

// Atualizar uma notificação agendada
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, body, url, scheduledFor } = await request.json()

    if (!title || !body || !scheduledFor) {
      return NextResponse.json({ error: "Título, corpo e data de agendamento são obrigatórios" }, { status: 400 })
    }

    const notifications = loadScheduledNotifications()
    const index = notifications.findIndex((n) => n.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 })
    }

    const updatedNotification = {
      ...notifications[index],
      title,
      body,
      url,
      scheduledFor: new Date(scheduledFor).toISOString(),
      updatedAt: new Date().toISOString(),
    }

    notifications[index] = updatedNotification
    saveScheduledNotifications(notifications)

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error("Erro ao atualizar notificação agendada:", error)
    return NextResponse.json({ error: "Falha ao atualizar notificação agendada" }, { status: 500 })
  }
}

// Excluir uma notificação agendada
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const notifications = loadScheduledNotifications()
    const filteredNotifications = notifications.filter((n) => n.id !== params.id)

    if (filteredNotifications.length === notifications.length) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 })
    }

    saveScheduledNotifications(filteredNotifications)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir notificação agendada:", error)
    return NextResponse.json({ error: "Falha ao excluir notificação agendada" }, { status: 500 })
  }
}
