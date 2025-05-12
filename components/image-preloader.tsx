"use client"

import { useEffect } from "react"

// Lista de imagens críticas para pré-carregar
const CRITICAL_IMAGES = ["/logo.png", "/icons/icon-192x192.png", "/favicon.ico"]

export default function ImagePreloader() {
  useEffect(() => {
    // Pré-carregar imagens críticas
    CRITICAL_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return null
}
