import { NextResponse } from "next/server"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authHeader = headersList.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    // Verificar se a variável de ambiente está configurada
    if (!cronSecret) {
      console.error("CRON_SECRET não está configurado")
      return NextResponse.json({ error: "Configuração de segurança ausente" }, { status: 500 })
    }

    // Verificar a autenticação
    // Aceitar tanto o cabeçalho Authorization quanto um parâmetro de consulta para compatibilidade com Cron-job.org
    const url = new URL(request.url)
    const querySecret = url.searchParams.get("secret")

    if (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      console.error("Tentativa de acesso não autorizado ao cron job")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Chamar a API de processamento de notificações
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || url.origin
    const processUrl = new URL("/api/notifications/process-scheduled", baseUrl)

    console.log(`Processando notificações agendadas: ${new Date().toISOString()}`)

    const response = await fetch(processUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()
    console.log("Resultado do processamento:", JSON.stringify(result))

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    })
  } catch (error: any) {
    console.error("Erro ao processar notificações agendadas:", error)
    return NextResponse.json(
      {
        error: "Falha ao processar notificações agendadas",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
