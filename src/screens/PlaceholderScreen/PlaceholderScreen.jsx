import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { ClipboardIcon } from '../../icons'
import './PlaceholderScreen.css'

// Tela generica para secoes que ainda nao foram desenhadas (Cadastro de
// Vacinas, Finalizar o Dia, Historico). Existe so para a navegacao nao
// quebrar; entra em uso quando o mockup de cada uma chegar.
function PlaceholderScreen({ title, onBack }) {
  return (
    <div className="placeholder-screen">
      <ScreenHeader title={title} subtitle="Vacinação" onBack={onBack} />
      <div className="placeholder-body">
        <span className="placeholder-icon">
          <ClipboardIcon size={32} />
        </span>
        <strong>Em construção</strong>
        <p>Essa tela ainda vai ser desenhada.</p>
      </div>
    </div>
  )
}

export default PlaceholderScreen
