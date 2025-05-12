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
          .register("/sw.js", {
            scope: "/",
            type: "classic",
          })
          .then((registration) => {
            console.log("Service Worker registrado com sucesso:", registration.scope)

            // Verificar atualizações do service worker
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing
              console.log("Novo Service Worker instalando:", newWorker)

              // Notificar o usuário sobre a atualização
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    // Há uma nova versão disponível
                    if (confirm("Nova versão disponível! Recarregar para atualizar?")) {
                      window.location.reload()
                    }
                  }
                })
              }
            })

            // Registrar para sincronização periódica (se suportado)
            if ("periodicSync" in registration) {
              const periodicSync = registration.periodicSync as any
              periodicSync
                .register("update-content", {
                  minInterval: 24 * 60 * 60 * 1000, // Uma vez por dia
                })
                .catch((error: any) => {
                  console.log("Erro ao registrar sincronização periódica:", error)
                })
            }
          })
          .catch((err) => {
            console.error("Falha ao registrar Service Worker:", err)
          })
      })

      // Lidar com atualizações de service worker
      let refreshing = false
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    } else {
      console.log("Service Worker não registrado: ambiente de desenvolvimento ou preview")
    }
  }, [])

  return null
}
