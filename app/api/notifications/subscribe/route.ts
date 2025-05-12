import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Em um ambiente de produção, você usaria um banco de dados
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), "data", "subscriptions.json")

// Carregar inscrições
const loadSubscriptions = (): PushSubscription[] => {
  const dir = path.dirname(SUBSCRIPTIONS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify([]), "utf8")
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
    const subscriptions = loadSubscriptions()

    // Verificar se a inscrição já existe
    const exists = subscriptions.some((sub) => sub.endpoint === subscription.endpoint)

    if (!exists) {
      subscriptions.push(subscription)
      saveSubscriptions(subscriptions)
      console.log("Nova inscrição adicionada")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar inscrição:", error)
    return NextResponse.json({ error: "Falha ao processar inscrição" }, { status: 500 })
  }
}
