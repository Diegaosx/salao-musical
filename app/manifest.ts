import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "com.salaomusical.app",
    name: process.env.NEXT_PUBLIC_APP_NAME || "Salão Musical de Lisboa",
    short_name: "Salão Musical",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Loja de instrumentos musicais desde 1958",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#002060",
    orientation: "portrait",
    categories: ["shopping", "music", "business"],
    dir: "ltr",
    lang: "pt-BR",
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
    prefer_related_applications: false,
    related_applications: [],
    scope: "/",
    screenshots: [
      {
        src: "/screenshots/home-screen.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "Tela inicial do Salão Musical",
      },
      {
        src: "/screenshots/product-screen.png",
        sizes: "1280x720",
        type: "image/png",
        platform: "wide",
        label: "Tela de produtos",
      },
    ],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192x192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    launch_handler: {
      client_mode: "auto",
    },
    handle_links: "preferred",
    shortcuts: [
      {
        name: "Produtos em Destaque",
        url: "/destaques",
        description: "Ver produtos em destaque",
        icons: [
          {
            src: "/icons/shortcut-star.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Contato",
        url: "/contacto",
        description: "Entre em contato conosco",
        icons: [
          {
            src: "/icons/shortcut-contact.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
    file_handlers: [
      {
        action: "/abrir-arquivo",
        accept: {
          "application/pdf": [".pdf"],
        },
      },
    ],
  }
}
