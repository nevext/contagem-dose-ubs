import { useRef, useState } from 'react'
import { SyringeIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import './VaccineCarousel.css'

const DRAG_THRESHOLD = 45
const TAP_TOLERANCE = 8

// Carrossel horizontal de vacinas cadastradas. No modo "deslizar" (padrao) a
// pessoa arrasta com o dedo pros lados pra trocar a vacina ativa; tocar num
// card so centraliza ele. No modo "selecionar" nao tem arrasto, tocar num
// card ja abre as informacoes daquela vacina direto.
function VaccineCarousel({ vaccines, activeIndex, onSelect, onPrev, onNext, selectionMode, onOpenInfo }) {
  const total = vaccines.length
  const prevIndex = (activeIndex - 1 + total) % total
  const nextIndex = (activeIndex + 1) % total
  const visible = total <= 3
    ? vaccines.map((vaccine, index) => ({ vaccine, index }))
    : [
        { vaccine: vaccines[prevIndex], index: prevIndex },
        { vaccine: vaccines[activeIndex], index: activeIndex },
        { vaccine: vaccines[nextIndex], index: nextIndex },
      ]

  const [dragX, setDragX] = useState(0)
  const dragState = useRef({ startX: 0, active: false, moved: false })

  const isDraggable = selectionMode === 'deslizar'

  const handlePointerDown = (event) => {
    if (!isDraggable) return
    dragState.current = { startX: event.clientX, active: true, moved: false }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDraggable || !dragState.current.active) return
    const delta = event.clientX - dragState.current.startX
    if (Math.abs(delta) > TAP_TOLERANCE) dragState.current.moved = true
    setDragX(delta)
  }

  const handlePointerUp = () => {
    if (!isDraggable || !dragState.current.active) return
    const delta = dragX
    dragState.current.active = false
    setDragX(0)
    if (delta > DRAG_THRESHOLD) onPrev()
    else if (delta < -DRAG_THRESHOLD) onNext()
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
      <div className="vaccine-carousel-track">
        <button type="button" className="clay-icon-button clay-tap vaccine-carousel-arrow" onClick={onPrev} aria-label="Vacina anterior">
          <ChevronLeftIcon size={20} />
        </button>

        <div
          className="vaccine-carousel-tiles"
          style={{ transform: dragX ? `translateX(${dragX * 0.4}px)` : undefined }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {visible.map(({ vaccine, index }) => (
            <button
              type="button"
              key={vaccine.id}
              className={`vaccine-tile clay-tap ${index === activeIndex ? 'vaccine-tile-active' : ''}`}
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

        <button type="button" className="clay-icon-button clay-tap vaccine-carousel-arrow" onClick={onNext} aria-label="Próxima vacina">
          <ChevronRightIcon size={20} />
        </button>
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
