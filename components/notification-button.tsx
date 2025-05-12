"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"

export default function NotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Verificar se o navegador suporta service workers e notificações
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false)
      return
    }

    // Registrar o service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setRegistration(reg)

        // Verificar se já existe uma inscrição
        return reg.pushManager.getSubscription()
      })
      .then((sub) => {
        if (sub) {
          setIsSubscribed(true)
        }
      })
      .catch((err) => {
        console.error("Erro ao registrar service worker:", err)
      })
  }, [])

  const toggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribeUser()
    } else {
      await subscribeUser()
    }
  }

  const subscribeUser = async () => {
    try {
      if (!registration) return

      // Solicitar permissão para notificações
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        console.log("Permissão para notificações negada")
        return
      }

      // Usar a chave pública VAPID do ambiente
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.error("Chave pública VAPID não encontrada")
        return
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

      // Inscrever o usuário
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })

      // Enviar a inscrição para o servidor
      await saveSubscription(newSubscription)

      setIsSubscribed(true)
    } catch (err) {
      console.error("Erro ao inscrever usuário:", err)
    }
  }

  const unsubscribeUser = async () => {
    try {
      const subscription = await registration?.pushManager.getSubscription()
      if (subscription) {
        // Cancelar a inscrição
        await subscription.unsubscribe()

        // Informar o servidor
        await deleteSubscription(subscription)

        setIsSubscribed(false)
      }
    } catch (err) {
      console.error("Erro ao cancelar inscrição:", err)
    }
  }

  // Função para salvar a inscrição no servidor
  const saveSubscription = async (subscription: PushSubscription) => {
    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) {
        throw new Error("Falha ao salvar inscrição")
      }
    } catch (err) {
      console.error("Erro ao salvar inscrição:", err)
    }
  }

  // Função para excluir a inscrição no servidor
  const deleteSubscription = async (subscription: PushSubscription) => {
    try {
      const response = await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir inscrição")
      }
    } catch (err) {
      console.error("Erro ao excluir inscrição:", err)
    }
  }

  // Função para converter a chave VAPID
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={toggleNotifications}
      className="fixed bottom-4 right-4 bg-[#002060] text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
      aria-label={isSubscribed ? "Desativar notificações" : "Ativar notificações"}
    >
      {isSubscribed ? <BellOff size={24} /> : <Bell size={24} />}
    </button>
  )
}
