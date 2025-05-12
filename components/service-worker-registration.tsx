"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Verificar se estamos em ambiente de produção (não em preview)
    const isProduction =
      typeof window !== "undefined" &&
      !window.location.hostname.includes("vusercontent.net") &&
      !window.location.hostname.includes("localhost") &&
      navigator.serviceWorker

    if (isProduction) {
      // Registrar o service worker apenas em produção
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registrado com sucesso:", registration.scope)
          })
          .catch((err) => {
            console.log("Falha ao registrar Service Worker:", err)
          })
      })
    } else {
      console.log("Service Worker não registrado: ambiente de desenvolvimento ou preview")
    }
  }, [])

  return null
}
