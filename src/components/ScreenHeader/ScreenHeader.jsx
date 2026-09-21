import { ChevronLeftIcon } from '../../icons'
import './ScreenHeader.css'

// Cabecalho padrao das telas internas: seta de voltar, titulo, subtitulo opcional
// e um botao de acao a direita (recebe o icone pronto via rightIcon).
function ScreenHeader({ title, subtitle, onBack, rightIcon, onRightAction, rightLabel = 'Mais opções' }) {
  return (
    <header className="screen-header">
      <button type="button" className="clay-icon-button clay-tap" onClick={onBack} aria-label="Voltar">
        <ChevronLeftIcon size={22} />
      </button>

      <div className="screen-header-titles">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {rightIcon ? (
        <button type="button" className="clay-icon-button clay-tap" onClick={onRightAction} aria-label={rightLabel}>
          {rightIcon}
        </button>
      ) : (
        <span className="screen-header-spacer" aria-hidden="true" />
      )}
    </header>
  )
}

export default ScreenHeader
