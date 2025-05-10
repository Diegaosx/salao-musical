import Image from "next/image"

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white">
      <div className="w-24 h-24 relative mb-4">
        <Image src="/logo.png" alt="Salão Musical de Lisboa" fill className="object-contain" />
      </div>
      <h1 className="text-xl font-bold text-[#002060] mb-4">Salão Musical de Lisboa</h1>
      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#002060] animate-progress"></div>
      </div>
    </div>
  )
}
