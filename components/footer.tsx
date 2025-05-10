import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#002060] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Salão Musical de Lisboa</h3>
            <p className="text-sm">Loja de instrumentos musicais desde 1958</p>
            <p className="text-sm mt-2">Rua da Alegria, 123</p>
            <p className="text-sm">1000-000 Lisboa</p>
            <p className="text-sm">Portugal</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="hover:underline">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/mapa-do-site" className="hover:underline">
                  Mapa do site
                </Link>
              </li>
              <li>
                <Link href="/quem-somos" className="hover:underline">
                  Quem somos
                </Link>
              </li>
              <li>
                <Link href="/historia-do-piano" className="hover:underline">
                  A História do Piano
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Informações</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos-e-condicoes" className="hover:underline">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:underline">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/entregas" className="hover:underline">
                  Entregas
                </Link>
              </li>
              <li>
                <Link href="/devolucoes" className="hover:underline">
                  Devoluções
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-blue-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Salão Musical de Lisboa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
