import { SyringeIcon, ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import './VaccineCarousel.css'

// Carrossel horizontal de vacinas cadastradas. Sempre mostra o item ativo no
// centro, maior, e os vizinhos ao redor. As setas e os dots andam pelo array
// com wrap around (do ultimo volta pro primeiro).
function VaccineCarousel({ vaccines, activeIndex, onSelect, onPrev, onNext }) {
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

  return (
    <div className="vaccine-carousel">
      <div className="vaccine-carousel-track">
        <button type="button" className="clay-icon-button vaccine-carousel-arrow" onClick={onPrev} aria-label="Vacina anterior">
          <ChevronLeftIcon size={20} />
        </button>

        <div className="vaccine-carousel-tiles">
          {visible.map(({ vaccine, index }) => (
            <button
              type="button"
              key={vaccine.id}
              className={`vaccine-tile ${index === activeIndex ? 'vaccine-tile-active' : ''}`}
              onClick={() => onSelect(index)}
            >
              <span className="vaccine-tile-icon">
                <SyringeIcon size={index === activeIndex ? 28 : 22} />
              </span>
              <strong>{vaccine.name}</strong>
              <span>{vaccine.subtitle}</span>
            </button>
          ))}
        </div>

        <button type="button" className="clay-icon-button vaccine-carousel-arrow" onClick={onNext} aria-label="Próxima vacina">
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
