import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { ScheduledNotification } from "@/types/notifications"

// Em um ambiente de produção, você usaria um banco de dados
// Aqui, usamos um arquivo JSON para simular um banco de dados
const DATA_FILE = path.join(process.cwd(), "data", "scheduled-notifications.json")

// Garantir que o diretório data exista
const ensureDirectoryExists = () => {
  const dir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Carregar notificações agendadas
const loadScheduledNotifications = (): ScheduledNotification[] => {
  ensureDirectoryExists()

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf8")
    return []
  }

  const data = fs.readFileSync(DATA_FILE, "utf8")
  return JSON.parse(data)
}

// Salvar notificações agendadas
const saveScheduledNotifications = (notifications: ScheduledNotification[]) => {
  ensureDirectoryExists()
  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2), "utf8")
}

// Obter todas as notificações agendadas
export async function GET() {
  try {
    const notifications = loadScheduledNotifications()
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Erro ao carregar notificações agendadas:", error)
    return NextResponse.json({ error: "Falha ao carregar notificações agendadas" }, { status: 500 })
  }
}

// Criar uma nova notificação agendada
export async function POST(request: Request) {
  try {
    const { title, body, url, scheduledFor } = await request.json()

    if (!title || !body || !scheduledFor) {
      return NextResponse.json({ error: "Título, corpo e data de agendamento são obrigatórios" }, { status: 400 })
    }

    const notifications = loadScheduledNotifications()

    const newNotification: ScheduledNotification = {
      id: uuidv4(),
      title,
      body,
      url,
      icon: "/icons/icon-192x192.png",
      scheduledFor: new Date(scheduledFor).toISOString(),
      sent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    notifications.push(newNotification)
    saveScheduledNotifications(notifications)

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar notificação agendada:", error)
    return NextResponse.json({ error: "Falha ao criar notificação agendada" }, { status: 500 })
  }
}
