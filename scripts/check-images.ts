// Este script pode ser executado para verificar se todas as imagens necessárias existem
// e criar versões de fallback se necessário

import fs from "fs"
import path from "path"
import { createCanvas } from "canvas"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const ICONS_DIR = path.join(PUBLIC_DIR, "icons")

// Verificar se o diretório de ícones existe
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

// Lista de arquivos de imagem que devem existir
const requiredImages = [
  { path: "/logo.png", width: 200, height: 200 },
  { path: "/icons/icon-192x192.png", width: 192, height: 192 },
  { path: "/icons/icon-512x512.png", width: 512, height: 512 },
  { path: "/icons/icon-192x192-maskable.png", width: 192, height: 192 },
  { path: "/icons/icon-512x512-maskable.png", width: 512, height: 512 },
  { path: "/icons/badge-72x72.png", width: 72, height: 72 },
  { path: "/icons/apple-icon-180x180.png", width: 180, height: 180 },
  { path: "/icons/icon-16x16.png", width: 16, height: 16 },
  { path: "/icons/icon-32x32.png", width: 32, height: 32 },
]

// Função para criar uma imagem de fallback
function createFallbackImage(filePath: string, width: number, height: number) {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  // Desenhar um fundo azul
  ctx.fillStyle = "#002060"
  ctx.fillRect(0, 0, width, height)

  // Adicionar texto
  const fontSize = Math.floor(width / 5)
  ctx.font = `bold ${fontSize}px Arial`
  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("SML", width / 2, height / 2)

  // Salvar a imagem
  const buffer = canvas.toBuffer("image/png")
  fs.writeFileSync(path.join(PUBLIC_DIR, filePath), buffer)

  console.log(`Imagem de fallback criada: ${filePath}`)
}

// Verificar cada imagem
for (const img of requiredImages) {
  const fullPath = path.join(PUBLIC_DIR, img.path)

  if (!fs.existsSync(fullPath)) {
    console.log(`Imagem não encontrada: ${img.path}`)

    // Criar diretório se necessário
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Criar imagem de fallback
    createFallbackImage(img.path, img.width, img.height)
  }
}

console.log("Verificação de imagens concluída!")
