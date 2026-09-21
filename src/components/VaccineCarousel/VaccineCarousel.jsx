import { useEffect, useRef, useState } from 'react'
import { SyringeIcon } from '../../icons'
import './VaccineCarousel.css'

// Roda de selecao de vacinas com scroll nativo do navegador (o mesmo
// mecanismo de um carrossel de fotos no celular, com scroll-snap
// centralizando o item mais proximo). No toque, quem cuida do arrasto e o
// proprio sistema, com a inercia e o freio dele; no mouse (desktop) a gente
// arrasta na mao porque nao tem drag nativo de scroll com botao pressionado.
// O destaque do item central acompanha o dedo em tempo real (liveIndex),
// enquanto o card de detalhe embaixo so "confirma" a troca quando o scroll
// realmente para, pra nao ficar trocando de vacina no meio do gesto.
function VaccineCarousel({ vaccines, activeIndex, onSelect, selectionMode, onOpenInfo }) {
  const viewportRef = useRef(null)
  const tileRefs = useRef([])
  const mouseDrag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false })
  const settleTimer = useRef(null)
  const liveFrame = useRef(null)
  const isSyncingScroll = useRef(false)
  const skipNextSync = useRef(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [liveIndex, setLiveIndex] = useState(activeIndex)

  const displayIndex = isScrolling ? liveIndex : activeIndex

  const closestToCenter = () => {
    const viewport = viewportRef.current
    if (!viewport) return activeIndex
    const center = viewport.scrollLeft + viewport.clientWidth / 2
    let closest = 0
    let closestDistance = Infinity
    tileRefs.current.forEach((tile, index) => {
      if (!tile) return
      const tileCenter = tile.offsetLeft + tile.offsetWidth / 2
      const distance = Math.abs(tileCenter - center)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = index
      }
    })
    return closest
  }

  const scrollToIndex = (index, smooth = true) => {
    const viewport = viewportRef.current
    const tile = tileRefs.current[index]
    if (!viewport || !tile) return
    const target = tile.offsetLeft + tile.offsetWidth / 2 - viewport.clientWidth / 2
    isSyncingScroll.current = true
    viewport.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' })
    window.setTimeout(() => {
      isSyncingScroll.current = false
    }, smooth ? 350 : 0)
  }

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    scrollToIndex(activeIndex)
  }, [activeIndex, vaccines.length])

  const handleScroll = () => {
    if (isSyncingScroll.current) return
    setIsScrolling(true)

    if (liveFrame.current) cancelAnimationFrame(liveFrame.current)
    liveFrame.current = requestAnimationFrame(() => setLiveIndex(closestToCenter()))

    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      setIsScrolling(false)
      const closest = closestToCenter()
      if (closest !== activeIndex) {
        skipNextSync.current = true
        onSelect(closest)
      }
    }, 100)
  }

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse') return
    const viewport = viewportRef.current
    mouseDrag.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: viewport.scrollLeft,
      moved: false,
      pointerId: event.pointerId,
    }
    // Nao captura o pointer aqui: um clique simples (sem mover) precisa
    // continuar chegando no botao da vacina normalmente. So capturamos
    // quando o movimento realmente comecar a virar arrasto (abaixo).
  }

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse' || !mouseDrag.current.active) return
    const delta = event.clientX - mouseDrag.current.startX
    if (Math.abs(delta) > 4 && !mouseDrag.current.moved) {
      mouseDrag.current.moved = true
      viewportRef.current.setPointerCapture?.(mouseDrag.current.pointerId)
    }
    if (mouseDrag.current.moved) {
      viewportRef.current.scrollLeft = mouseDrag.current.startScrollLeft - delta
    }
  }

  const stopMouseDrag = () => {
    if (mouseDrag.current.moved) {
      viewportRef.current?.releasePointerCapture?.(mouseDrag.current.pointerId)
    }
    mouseDrag.current.active = false
  }

  const handleTileClick = (vaccine, index) => {
    if (mouseDrag.current.moved) {
      mouseDrag.current.moved = false
      return
    }
    if (selectionMode === 'selecionar') {
      onSelect(index)
      onOpenInfo(vaccine.id)
      return
    }
    if (index === activeIndex) return
    onSelect(index)
  }

  return (
    <div className="vaccine-carousel">
      <div
        className="vaccine-carousel-viewport"
        ref={viewportRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopMouseDrag}
        onPointerLeave={stopMouseDrag}
      >
        {vaccines.map((vaccine, index) => (
          <button
            type="button"
            key={vaccine.id}
            ref={(node) => {
              tileRefs.current[index] = node
            }}
            className={`vaccine-tile clay-tap ${index === displayIndex ? 'vaccine-tile-active' : ''}`}
            onClick={() => handleTileClick(vaccine, index)}
          >
            <span className="vaccine-tile-icon">
              <SyringeIcon size={index === displayIndex ? 28 : 22} />
            </span>
            <strong>{vaccine.name}</strong>
            <span>{vaccine.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="vaccine-carousel-dots">
        {vaccines.map((vaccine, index) => (
          <span key={vaccine.id} className={`vaccine-dot ${index === displayIndex ? 'vaccine-dot-active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default VaccineCarousel
