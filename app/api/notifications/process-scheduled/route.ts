import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import webpush from "web-push"
import type { ScheduledNotification } from "@/types/notifications"

// Em um ambiente de produção, você usaria um banco de dados
const DATA_FILE = path.join(process.cwd(), "data", "scheduled-notifications.json")
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), "data", "subscriptions.json")
const LOG_FILE = path.join(process.cwd(), "data", "notification-logs.json")

// Configurar as chaves VAPID
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
}

// Verificar se as chaves VAPID estão definidas
if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  console.error("Chaves VAPID não configuradas corretamente")
}

// Configurar o webpush com as chaves VAPID
const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://salao.avisatudo.com"
webpush.setVapidDetails(
  `mailto:contato@${domain.replace(/^https?:\/\//, "")}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey,
)

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

// Carregar inscrições
const loadSubscriptions = (): PushSubscription[] => {
  ensureDirectoryExists()

  if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify([]), "utf8")
    return []
  }

  const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf8")
  return JSON.parse(data)
}

// Salvar inscrições
const saveSubscriptions = (subscriptions: PushSubscription[]) => {
  ensureDirectoryExists()
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2), "utf8")
}

// Registrar log
const logNotificationProcessing = (log: any) => {
  ensureDirectoryExists()

  let logs = []
  if (fs.existsSync(LOG_FILE)) {
    const data = fs.readFileSync(LOG_FILE, "utf8")
    logs = JSON.parse(data)
  }

  logs.push({
    ...log,
    timestamp: new Date().toISOString(),
  })

  // Manter apenas os últimos 100 logs
  if (logs.length > 100) {
    logs = logs.slice(-100)
  }

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf8")
}

// Processar notificações agendadas
export async function GET() {
  try {
    const now = new Date()
    console.log(`Iniciando processamento de notificações: ${now.toISOString()}`)

    const notifications = loadScheduledNotifications()
    const subscriptions = loadSubscriptions()

    if (subscriptions.length === 0) {
      console.log("Nenhuma inscrição encontrada")
      return NextResponse.json({ message: "Nenhuma inscrição encontrada" })
    }

    const pendingNotifications = notifications.filter((n) => !n.sent && new Date(n.scheduledFor) <= now)

    if (pendingNotifications.length === 0) {
      console.log("Nenhuma notificação pendente")
      return NextResponse.json({ message: "Nenhuma notificação pendente" })
    }

    console.log(`Encontradas ${pendingNotifications.length} notificações pendentes`)
    const results = []
    const invalidSubscriptions = []

    for (const notification of pendingNotifications) {
      console.log(`Processando notificação: ${notification.id} - ${notification.title}`)

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        url: notification.url || "/",
        icon: notification.icon || "/icons/icon-192x192.png",
      })

      const sendPromises = subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payload)
          return { success: true, endpoint: subscription.endpoint }
        } catch (error: any) {
          console.error(`Erro ao enviar notificação para ${subscription.endpoint}:`, error.message)

          // Marcar inscrições inválidas para remoção
          if (error.statusCode === 404 || error.statusCode === 410) {
            invalidSubscriptions.push(subscription.endpoint)
          }

          return {
            success: false,
            endpoint: subscription.endpoint,
            error: error.message,
          }
        }
      })

      const sendResults = await Promise.all(sendPromises)

      // Atualizar o status da notificação
      notification.sent = true
      notification.updatedAt = new Date().toISOString()

      const notificationResult = {
        notification: {
          id: notification.id,
          title: notification.title,
          scheduledFor: notification.scheduledFor,
        },
        results: sendResults,
        sent: sendResults.filter((r) => r.success).length,
        failed: sendResults.filter((r) => !r.success).length,
      }

      results.push(notificationResult)

      // Registrar log
      logNotificationProcessing(notificationResult)
    }

    // Remover inscrições inválidas
    if (invalidSubscriptions.length > 0) {
      console.log(`Removendo ${invalidSubscriptions.length} inscrições inválidas`)
      const validSubscriptions = subscriptions.filter((sub) => !invalidSubscriptions.includes(sub.endpoint))
      saveSubscriptions(validSubscriptions)
    }

    // Salvar as notificações atualizadas
    saveScheduledNotifications(notifications)

    const response = {
      success: true,
      processed: pendingNotifications.length,
      results,
    }

    console.log(`Processamento concluído: ${pendingNotifications.length} notificações processadas`)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Erro ao processar notificações agendadas:", error)

    // Registrar log de erro
    logNotificationProcessing({
      error: true,
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      { error: "Falha ao processar notificações agendadas", message: error.message },
      { status: 500 },
    )
  }
}
