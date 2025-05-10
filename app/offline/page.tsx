import Link from "next/link"

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4 text-[#002060]">Você está offline</h1>
      <p className="mb-6">Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.</p>
      <Link href="/" className="bg-[#002060] text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors">
        Tentar novamente
      </Link>
    </div>
  )
}
