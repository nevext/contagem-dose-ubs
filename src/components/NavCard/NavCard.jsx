import { ChevronRightIcon } from '../../icons'
import './NavCard.css'

// Card de navegacao usado na Home e na tela de Vacinacao.
// variant="featured" destaca o card (fundo verde solido, texto claro).
// disabled remove a interacao e mostra o visual "em breve".
function NavCard({ icon, title, subtitle, onClick, variant = 'default', disabled = false }) {
  const className = [
    'nav-card',
    'clay-tap',
    variant === 'featured' ? 'nav-card-featured' : '',
    disabled ? 'nav-card-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      <span className="nav-card-icon">{icon}</span>
      <span className="nav-card-texts">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </span>
      <ChevronRightIcon size={20} className="nav-card-chevron" />
    </button>
  )
}

export default NavCard
