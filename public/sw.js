// Nome do cache
const CACHE_NAME = "salao-musical-v1"

// Arquivos para cache inicial
const urlsToCache = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/badge-72x72.png",
]

// Instalação do service worker
self.addEventListener("install", (event) => {
  // Pré-cache de recursos importantes
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache aberto")
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting()), // Força o service worker a se tornar ativo
  )
})

// Ativação do service worker
self.addEventListener("activate", (event) => {
  // Limpar caches antigos
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Removendo cache antigo:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()), // Tomar controle de todos os clientes
  )
})

// Interceptação de requisições fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retornar resposta do cache
      if (response) {
        return response
      }

      // Clonar a requisição porque ela só pode ser consumida uma vez
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Verificar se a resposta é válida
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clonar a resposta porque ela só pode ser consumida uma vez
          const responseToCache = response.clone()

          // Adicionar ao cache para uso futuro
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Se falhar (offline), tentar servir a página offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }
        })
    }),
  )
})

// Lidar com notificações push
self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json()

      const options = {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png",
        badge: data.badge || "/icons/badge-72x72.png",
        vibrate: [100, 50, 100],
        data: {
          url: data.url || "/",
          dateOfArrival: Date.now(),
        },
      }

      event.waitUntil(self.registration.showNotification(data.title, options))
    } catch (e) {
      console.error("Erro ao processar notificação push:", e)
    }
  }
})

// Lidar com cliques em notificações
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  // Tentar abrir a URL específica da notificação ou a raiz
  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Verificar se já há uma janela aberta e focar nela
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus()
        }
      }

      // Se não houver janela aberta, abrir uma nova
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})
