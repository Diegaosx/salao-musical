import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Em um ambiente de produção, você usaria um banco de dados
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), "data", "subscriptions.json")

// Carregar inscrições
const loadSubscriptions = (): PushSubscription[] => {
  if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
    return []
  }

  const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf8")
  return JSON.parse(data)
}

// Salvar inscrições
const saveSubscriptions = (subscriptions: PushSubscription[]) => {
  const dir = path.dirname(SUBSCRIPTIONS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2), "utf8")
}

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    let subscriptions = loadSubscriptions()

    // Remover a inscrição da lista
    subscriptions = subscriptions.filter((sub) => sub.endpoint !== subscription.endpoint)
    saveSubscriptions(subscriptions)

    console.log("Inscrição removida")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar cancelamento de inscrição:", error)
    return NextResponse.json({ error: "Falha ao processar cancelamento de inscrição" }, { status: 500 })
  }
}
