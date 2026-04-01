"use client"

import { useRef, useState, useMemo } from "react"
import { Play, Pause } from "lucide-react"

export function formatTime(s: number) {
  if (!isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}

interface AudioPlayerProps {
  src: string
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const togglePlay = async () => {
    const a = audioRef.current
    if (!a || hasError) return
    
    if (isPlaying) {
      a.pause()
      setIsPlaying(false)
    } else {
      try {
        // Verificar si el audio está listo para reproducir
        if (a.readyState >= 2) {
          await a.play()
          setIsPlaying(true)
        } else {
          console.log('Audio not ready, waiting...')
          setHasError(true)
        }
      } catch (error) {
        console.error('Error playing audio:', error)
        setIsPlaying(false)
        setHasError(true)
      }
    }
  }

  const progress = useMemo(() => (duration ? (current / duration) * 100 : 0), [current, duration])

  return (
    <div>
      <div className="flex flex-col">
        <div className="relative mb-3">
          <div className="h-1.5 w-full bg-slate-200 rounded-full" />
          <div
            className="absolute left-0 top-0 h-1.5 rounded-full"
            style={{ width: `${progress}%`, backgroundColor: '#462BDD' }}
          />
          <input
            type="range"
            className="absolute inset-0 h-1.5 w-full cursor-pointer appearance-none bg-transparent"
            style={{
              background: 'transparent',
              WebkitAppearance: 'none',
            }}
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => {
              const a = audioRef.current
              if (!a) return
              const next = Number(e.currentTarget.value)
              a.currentTime = next
              setCurrent(next)
            }}
            aria-label="Barra de progreso"
          />
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #462BDD;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
            }
            input[type="range"]::-moz-range-thumb {
              height: 16px;
              width: 16px;
              border-radius: 50%;
              background: #462BDD;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
            }
          `}</style>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={togglePlay}
            disabled={hasError || isLoading}
            aria-label={hasError ? "Audio no disponible" : isLoading ? "Cargando audio..." : isPlaying ? "Pausar audio" : "Reproducir audio"}
            className={`inline-flex w-8 h-8 items-center justify-center rounded-md border border-slate-200 bg-white text-gray-700 hover:bg-gray-50 ${
              hasError || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : hasError ? (
              <div className="w-4 h-4 bg-red-400 rounded-full" />
            ) : isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>

          <div className="text-sm tabular-nums">
            {formatTime(current)}/{formatTime(duration)}
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0)
          setIsLoading(false)
          setHasError(false)
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio loading error:', e)
          setHasError(true)
          setIsLoading(false)
        }}
        onCanPlay={() => {
          setIsLoading(false)
          setHasError(false)
        }}
      />
    </div>
  )
}