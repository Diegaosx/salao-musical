"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Salão Musical de Lisboa" width={60} height={60} className="mr-2" />
              <div className="hidden sm:block">
                <h1 className="text-[#002060] text-xl font-bold">Salão Musical de Lisboa</h1>
                <p className="text-xs text-gray-600">Loja de instrumentos musicais desde 1958</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="relative mr-2">
              <input
                type="text"
                placeholder="Procurar"
                className="border rounded-md py-1 px-3 pr-8 text-sm w-full max-w-[200px]"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Link href="/carrinho" className="relative">
              <ShoppingCart className="h-6 w-6 text-[#002060]" />
              <span className="absolute -top-2 -right-2 bg-[#002060] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="space-y-2">
              <li>
                <Link href="/categorias/pianos" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Pianos
                </Link>
              </li>
              <li>
                <Link href="/categorias/cordas" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Instrumentos Cordas
                </Link>
              </li>
              <li>
                <Link href="/categorias/sopro" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Sopro
                </Link>
              </li>
              <li>
                <Link href="/categorias/percussao" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Percussão
                </Link>
              </li>
              <li>
                <Link href="/categorias/teclados" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Teclados
                </Link>
              </li>
              <li>
                <Link href="/categorias/acordeoes" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Acordeões
                </Link>
              </li>
              <li>
                <Link href="/categorias/amplificacao" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Amplificação
                </Link>
              </li>
              <li>
                <Link href="/categorias/acessorios" className="block py-2 px-4 hover:bg-gray-100 rounded-md">
                  Acessórios
                </Link>
              </li>
            </ul>
          </nav>
        )}

        <nav className="hidden md:block mt-4 border-t pt-2">
          <ul className="flex space-x-6 overflow-x-auto text-sm">
            <li>
              <Link href="/categorias/pianos" className="text-[#002060] hover:underline whitespace-nowrap">
                Pianos
              </Link>
            </li>
            <li>
              <Link href="/categorias/cordas" className="text-[#002060] hover:underline whitespace-nowrap">
                Instrumentos Cordas
              </Link>
            </li>
            <li>
              <Link href="/categorias/sopro" className="text-[#002060] hover:underline whitespace-nowrap">
                Sopro
              </Link>
            </li>
            <li>
              <Link href="/categorias/percussao" className="text-[#002060] hover:underline whitespace-nowrap">
                Percussão
              </Link>
            </li>
            <li>
              <Link href="/categorias/teclados" className="text-[#002060] hover:underline whitespace-nowrap">
                Teclados
              </Link>
            </li>
            <li>
              <Link href="/categorias/acordeoes" className="text-[#002060] hover:underline whitespace-nowrap">
                Acordeões
              </Link>
            </li>
            <li>
              <Link href="/categorias/amplificacao" className="text-[#002060] hover:underline whitespace-nowrap">
                Amplificação
              </Link>
            </li>
            <li>
              <Link href="/categorias/acessorios" className="text-[#002060] hover:underline whitespace-nowrap">
                Acessórios
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
