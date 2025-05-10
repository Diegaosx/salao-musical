import { NextResponse } from "next/server"

// Em um ambiente de produção, você usaria um banco de dados
// para armazenar as inscrições
let subscriptions: PushSubscription[] = []

export async function POST(request: Request) {
  try {
    const subscription = await request.json()

    // Remover a inscrição da lista
    subscriptions = subscriptions.filter((sub) => sub.endpoint !== subscription.endpoint)

    console.log("Inscrição removida")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar cancelamento de inscrição:", error)
    return NextResponse.json({ error: "Falha ao processar cancelamento de inscrição" }, { status: 500 })
  }
}
