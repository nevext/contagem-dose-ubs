import { useCallback, useEffect, useRef } from 'react'
import { SyringeIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import './VaccineCarousel.css'

const ITEM_WIDTH = 96
const MAX_DISTANCE = 2.2

// Seletor de vacinas em roleta, no estilo dos pickers do iOS: arrasta com o
// dedo ou o mouse, solta e encaixa na vacina mais proxima do centro. Tamanho,
// nitidez e opacidade de cada item sao recalculados a cada frame de scroll,
// entao a hierarquia visual acompanha o gesto em tempo real, nao so o estado
// parado.
function VaccineCarousel({ vaccines, activeIndex, onSelect, onPrev, onNext }) {
  const trackRef = useRef(null)
  const itemRefs = useRef([])
  const rafRef = useRef(null)
  const settleTimerRef = useRef(null)
  const draggingRef = useRef(false)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)

  const applyStyles = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const trackRect = track.getBoundingClientRect()
    const centerX = trackRect.left + trackRect.width / 2

    itemRefs.current.forEach((el) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const itemCenterX = rect.left + rect.width / 2
      const distance = Math.min(Math.abs(itemCenterX - centerX) / ITEM_WIDTH, MAX_DISTANCE)
      const scale = 1 - distance * 0.26
      const blur = distance * 2.6
      const opacity = 1 - distance * 0.38

      el.style.transform = `scale(${Math.max(0.5, scale).toFixed(3)})`
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none'
      el.style.opacity = Math.max(0.3, opacity).toFixed(2)
      el.style.zIndex = String(Math.round((MAX_DISTANCE - distance) * 10))
    })
  }, [])

  const scheduleApplyStyles = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      applyStyles()
    })
  }, [applyStyles])

  const findNearestIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const trackRect = track.getBoundingClientRect()
    const centerX = trackRect.left + trackRect.width / 2
    let nearest = 0
    let nearestDistance = Infinity
    itemRefs.current.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - centerX)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = index
      }
    })
    return nearest
  }, [])

  const centerIndex = useCallback((index, smooth = true) => {
    const el = itemRefs.current[index]
    const track = trackRef.current
    if (!el || !track) return
    const trackRect = track.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const delta = rect.left + rect.width / 2 - (trackRect.left + trackRect.width / 2)
    if (Math.abs(delta) < 1) return
    track.scrollBy({ left: delta, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  const handleScroll = useCallback(() => {
    scheduleApplyStyles()
    if (draggingRef.current) return
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
    settleTimerRef.current = setTimeout(() => {
      const nearest = findNearestIndex()
      if (nearest !== activeIndex) onSelect(nearest)
    }, 130)
  }, [scheduleApplyStyles, findNearestIndex, activeIndex, onSelect])

  useEffect(() => {
    applyStyles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaccines.length])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
  }, [])

  useEffect(() => {
    if (draggingRef.current) return
    centerIndex(activeIndex, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  useEffect(() => {
    centerIndex(activeIndex, false)
    // roda so na primeira montagem, pra abrir ja centralizado sem animar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (event.pointerType !== 'mouse') return // toque usa o scroll nativo, com inercia de verdade
    const track = trackRef.current
    if (!track) return
    draggingRef.current = true
    suppressClickRef.current = false
    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      lastX: event.clientX,
      lastT: performance.now(),
      velocity: 0,
    }
    track.setPointerCapture(event.pointerId)
    track.classList.add('vaccine-carousel-track-dragging')
  }

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return
    const track = trackRef.current
    const drag = dragRef.current
    const dx = event.clientX - drag.startX
    if (Math.abs(dx) > 4) suppressClickRef.current = true
    track.scrollLeft = drag.startScrollLeft - dx

    const now = performance.now()
    const dt = now - drag.lastT
    if (dt > 0) drag.velocity = (event.clientX - drag.lastX) / dt
    drag.lastX = event.clientX
    drag.lastT = now
    scheduleApplyStyles()
  }

  const endDrag = (event) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    const track = trackRef.current
    track?.classList.remove('vaccine-carousel-track-dragging')
    if (track && event?.pointerId !== undefined) {
      try {
        track.releasePointerCapture(event.pointerId)
      } catch {
        // ja liberado, ignora
      }
    }

    const drag = dragRef.current
    const momentum = Math.max(-320, Math.min(320, (drag?.velocity ?? 0) * 90))
    if (track && Math.abs(momentum) > 2) {
      track.scrollBy({ left: -momentum, behavior: 'smooth' })
    }

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
    settleTimerRef.current = setTimeout(() => {
      const nearest = findNearestIndex()
      centerIndex(nearest)
      if (nearest !== activeIndex) onSelect(nearest)
    }, 260)
  }

  const handleItemClick = (index) => (event) => {
    if (suppressClickRef.current) {
      event.preventDefault()
      suppressClickRef.current = false
      return
    }
    if (index !== activeIndex) onSelect(index)
    else centerIndex(index)
  }

  return (
    <div className="vaccine-carousel">
      <div className="vaccine-carousel-row">
        <button type="button" className="clay-icon-button clay-tap vaccine-carousel-arrow" onClick={onPrev} aria-label="Vacina anterior">
          <ChevronLeftIcon size={20} />
        </button>

        <div
          className="vaccine-carousel-track"
          ref={trackRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {vaccines.map((vaccine, index) => (
            <button
              type="button"
              key={vaccine.id}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className={`vaccine-tile clay-tap ${index === activeIndex ? 'vaccine-tile-active' : ''}`}
              onClick={handleItemClick(index)}
            >
              <span className="vaccine-tile-icon">
                <SyringeIcon size={24} />
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
