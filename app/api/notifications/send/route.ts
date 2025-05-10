import { NextResponse } from "next/server"
import webpush from "web-push"

// Em um ambiente de produção, você usaria um banco de dados
// para armazenar as inscrições
let subscriptions: PushSubscription[] = []

// Configurar as chaves VAPID (em produção, devem ser armazenadas como variáveis de ambiente)
const vapidKeys = {
  publicKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
  privateKey: "Xt4Z-sxMTJVvLxkcK-mZYUARxcVde0vZaXWyGPQEgqo",
}

webpush.setVapidDetails("mailto:exemplo@salaomusical.com", vapidKeys.publicKey, vapidKeys.privateKey)

export async function POST(request: Request) {
  try {
    const { title, body, url, icon } = await request.json()

    if (!title || !body) {
      return NextResponse.json({ error: "Título e corpo da mensagem são obrigatórios" }, { status: 400 })
    }

    // Verificar se há inscrições
    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "Nenhuma inscrição encontrada" }, { status: 404 })
    }

    // Preparar a notificação
    const notification = {
      title,
      body,
      url: url || "/",
      icon: icon || "/icons/icon-192x192.png",
    }

    // Enviar a notificação para todas as inscrições
    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(notification))
        return { success: true, endpoint: subscription.endpoint }
      } catch (error) {
        console.error("Erro ao enviar notificação:", error)

        // Se a inscrição não for mais válida, removê-la
        if (error.statusCode === 404 || error.statusCode === 410) {
          subscriptions = subscriptions.filter((sub) => sub.endpoint !== subscription.endpoint)
        }

        return {
          success: false,
          endpoint: subscription.endpoint,
          error: error.message,
        }
      }
    })

    const results = await Promise.all(sendPromises)

    return NextResponse.json({
      success: true,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    })
  } catch (error) {
    console.error("Erro ao processar envio de notificação:", error)
    return NextResponse.json({ error: "Falha ao processar envio de notificação" }, { status: 500 })
  }
}
