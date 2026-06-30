import { BookOpen, LoaderCircle } from "lucide-react"

const LoadingOverlay = () => {
  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-shadow-wrapper bg-[#fff6e5] shadow-2xl">
        <div className="loading-shadow">
          <div className="relative">
            <BookOpen className="size-12 text-[#663820]" aria-hidden="true" />
            <LoaderCircle
              className="loading-animation absolute -inset-3 size-18 text-[#b9835a]"
              aria-hidden="true"
            />
          </div>
          <div className="text-center">
            <p className="loading-title font-serif">Beginning synthesis</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Preparing your book and assistant voice…
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
