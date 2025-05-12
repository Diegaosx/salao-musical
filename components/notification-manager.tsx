"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

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
          setSubscription(sub)
        }
      })
      .catch((err) => {
        console.error("Erro ao registrar service worker:", err)
      })
  }, [])

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

      setSubscription(newSubscription)
      setIsSubscribed(true)
    } catch (err) {
      console.error("Erro ao inscrever usuário:", err)
    }
  }

  const unsubscribeUser = async () => {
    try {
      if (subscription) {
        // Cancelar a inscrição
        await subscription.unsubscribe()

        // Informar o servidor
        await deleteSubscription(subscription)

        setIsSubscribed(false)
        setSubscription(null)
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
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative">
        <Bell className="h-5 w-5" />
        {isSubscribed && <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2 h-2" />}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
            <DialogDescription>
              Receba notificações sobre promoções, novos produtos e eventos do Salão Musical.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isSubscribed ? (
              <p className="text-green-600 mb-4">Você está inscrito para receber notificações!</p>
            ) : (
              <p className="mb-4">Clique no botão abaixo para ativar as notificações.</p>
            )}
          </div>

          <DialogFooter>
            {isSubscribed ? (
              <Button variant="destructive" onClick={unsubscribeUser}>
                Desativar Notificações
              </Button>
            ) : (
              <Button onClick={subscribeUser}>Ativar Notificações</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
