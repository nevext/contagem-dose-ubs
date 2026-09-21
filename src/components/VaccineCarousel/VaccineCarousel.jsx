import { useRef, useState } from 'react'
import { SyringeIcon } from '../../icons'
import './VaccineCarousel.css'

const TILE_WIDTH = 104
const TILE_GAP = 10
const TILE_STEP = TILE_WIDTH + TILE_GAP
const TAP_TOLERANCE = 8
const EDGE_RESISTANCE = 0.35

// Roda de selecao de verdade: uma faixa continua com todas as vacinas,
// que segue o dedo 1:1 enquanto arrasta e encaixa na vacina mais proxima
// do centro ao soltar. Funciona nos dois modos de selecao; o que muda
// entre "deslizar" e "selecionar" e so o que um toque simples faz.
function VaccineCarousel({ vaccines, activeIndex, onSelect, selectionMode, onOpenInfo }) {
  const total = vaccines.length
  const [dragDelta, setDragDelta] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, moved: false })

  const atStart = activeIndex === 0
  const atEnd = activeIndex === total - 1
  let effectiveDrag = dragDelta
  if (atStart && dragDelta > 0) effectiveDrag = dragDelta * EDGE_RESISTANCE
  if (atEnd && dragDelta < 0) effectiveDrag = dragDelta * EDGE_RESISTANCE

  const baseOffset = activeIndex * TILE_STEP + TILE_WIDTH / 2
  const translateX = -baseOffset + effectiveDrag

  const handlePointerDown = (event) => {
    if (total === 0) return
    dragState.current = { startX: event.clientX, moved: false }
    setIsDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDragging) return
    const delta = event.clientX - dragState.current.startX
    if (Math.abs(delta) > TAP_TOLERANCE) dragState.current.moved = true
    setDragDelta(delta)
  }

  const finishDrag = () => {
    if (!isDragging) return
    const stepsMoved = Math.round(dragDelta / TILE_STEP)
    const newIndex = Math.min(total - 1, Math.max(0, activeIndex - stepsMoved))
    setIsDragging(false)
    setDragDelta(0)
    if (newIndex !== activeIndex) onSelect(newIndex)
  }

  const handleTileClick = (vaccine, index) => {
    if (dragState.current.moved) {
      dragState.current.moved = false
      return
    }
    onSelect(index)
    if (selectionMode === 'selecionar') onOpenInfo(vaccine.id)
  }

  return (
    <div className="vaccine-carousel">
      <div
        className="vaccine-carousel-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerLeave={finishDrag}
      >
        <div
          className="vaccine-carousel-track"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {vaccines.map((vaccine, index) => (
            <button
              type="button"
              key={vaccine.id}
              className={`vaccine-tile clay-tap ${index === activeIndex ? 'vaccine-tile-active' : ''}`}
              style={{ width: TILE_WIDTH }}
              onClick={() => handleTileClick(vaccine, index)}
            >
              <span className="vaccine-tile-icon">
                <SyringeIcon size={index === activeIndex ? 28 : 22} />
              </span>
              <strong>{vaccine.name}</strong>
              <span>{vaccine.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="vaccine-carousel-dots">
        {vaccines.map((vaccine, index) => (
          <span key={vaccine.id} className={`vaccine-dot ${index === activeIndex ? 'vaccine-dot-active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default VaccineCarousel
