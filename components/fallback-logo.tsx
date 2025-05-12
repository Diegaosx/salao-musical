export default function FallbackLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`bg-[#002060] rounded-full flex items-center justify-center text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      SML
    </div>
  )
}
