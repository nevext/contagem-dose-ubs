import { useEffect, useRef, useState } from 'react'
import { SyringeIcon } from '../../icons'
import './VaccineCarousel.css'

// Roda de selecao de vacinas com scroll nativo do navegador (o mesmo
// mecanismo de um carrossel de fotos no celular, com scroll-snap
// centralizando o item mais proximo). Isso da o "encaixe" natural que um
// carrossel feito na mao com transform nunca acerta direito: no toque, quem
// cuida do arrasto e o proprio sistema, com a inercia e o "freio" dele. Só
// no mouse (desktop) a gente arrasta a mao porque nao tem drag nativo de
// scroll com botao pressionado.
function VaccineCarousel({ vaccines, activeIndex, onSelect, selectionMode, onOpenInfo }) {
  const viewportRef = useRef(null)
  const tileRefs = useRef([])
  const mouseDrag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false })
  const settleTimer = useRef(null)
  const isSyncingScroll = useRef(false)
  const [isUserScrolling, setIsUserScrolling] = useState(false)

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
    if (isUserScrolling) return
    scrollToIndex(activeIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, vaccines.length])

  const handleScroll = () => {
    if (isSyncingScroll.current) return
    setIsUserScrolling(true)
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      setIsUserScrolling(false)
      const viewport = viewportRef.current
      if (!viewport) return
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
      if (closest !== activeIndex) onSelect(closest)
    }, 120)
  }

  const handlePointerDown = (event) => {
    if (event.pointerType !== 'mouse') return
    const viewport = viewportRef.current
    mouseDrag.current = { active: true, startX: event.clientX, startScrollLeft: viewport.scrollLeft, moved: false }
    viewport.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse' || !mouseDrag.current.active) return
    const delta = event.clientX - mouseDrag.current.startX
    if (Math.abs(delta) > 4) mouseDrag.current.moved = true
    viewportRef.current.scrollLeft = mouseDrag.current.startScrollLeft - delta
  }

  const stopMouseDrag = () => {
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

      <div className="vaccine-carousel-dots">
        {vaccines.map((vaccine, index) => (
          <span key={vaccine.id} className={`vaccine-dot ${index === activeIndex ? 'vaccine-dot-active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default VaccineCarousel
