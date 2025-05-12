// Nome do cache
const CACHE_NAME = "salao-musical-v1"

// Arquivos para cache inicial
const urlsToCache = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-192x192-maskable.png",
  "/icons/icon-512x512-maskable.png",
  "/icons/badge-72x72.png",
  "/logo.png",
  "/music-store-logo-sm.png",
  "/css/main.css",
  "/js/app.js",
]

// Instalação do service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache aberto")
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting()),
  )
})

// Ativação do service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Estratégia de cache: Cache First, falling back to network
self.addEventListener("fetch", (event) => {
  // Ignorar requisições para API e análises
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("analytics") ||
    event.request.url.includes("chrome-extension")
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retornar resposta do cache
      if (response) {
        return response
      }

      // Clonar a requisição
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Verificar se a resposta é válida
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clonar a resposta
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

          // Para imagens, retornar uma imagem padrão
          if (event.request.destination === "image") {
            return caches.match("/icons/offline-image.png")
          }

          // Para outros recursos, retornar um erro
          return new Response("Não foi possível carregar o recurso. Você está offline.", {
            status: 503,
            statusText: "Serviço indisponível",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          })
        })
    }),
  )
})

// Sincronização em segundo plano
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Função para sincronizar dados quando online
async function syncData() {
  const db = await openDatabase()
  const pendingActions = await db.getAll("pendingActions")

  for (const action of pendingActions) {
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      })

      if (response.ok) {
        await db.delete("pendingActions", action.id)
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error)
    }
  }
}

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
        actions: [
          {
            action: "view",
            title: "Ver",
            icon: "/icons/view-action.png",
          },
          {
            action: "close",
            title: "Fechar",
            icon: "/icons/close-action.png",
          },
        ],
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

  if (event.action === "close") {
    return
  }

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

// Função para abrir o banco de dados IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SalaoMusicalDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("pendingActions")) {
        db.createObjectStore("pendingActions", { keyPath: "id" })
      }
    }
  })
}

// Lidar com atualizações periódicas em segundo plano
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-content") {
    event.waitUntil(updateContent())
  }
})

// Função para atualizar conteúdo em segundo plano
async function updateContent() {
  try {
    // Buscar novos dados
    const response = await fetch("/api/updates")
    const data = await response.json()

    // Atualizar o cache com os novos dados
    const cache = await caches.open(CACHE_NAME)

    // Atualizar páginas principais
    if (data.pages) {
      for (const page of data.pages) {
        const response = await fetch(page)
        await cache.put(page, response)
      }
    }

    // Notificar o usuário se necessário
    if (data.notification) {
      await self.registration.showNotification(data.notification.title, data.notification.options)
    }
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error)
  }
}
