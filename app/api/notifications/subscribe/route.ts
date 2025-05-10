import { NextResponse } from "next/server"

// Em um ambiente de produção, você usaria um banco de dados
// para armazenar as inscrições
const subscriptions: PushSubscription[] = []

export async function POST(request: Request) {
  try {
    const subscription = await request.json()

    // Verificar se a inscrição já existe
    const exists = subscriptions.some((sub) => sub.endpoint === subscription.endpoint)

    if (!exists) {
      subscriptions.push(subscription)
      console.log("Nova inscrição adicionada")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar inscrição:", error)
    return NextResponse.json({ error: "Falha ao processar inscrição" }, { status: 500 })
  }
}
