import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { CheckIcon } from '../../icons'
import './SettingsScreen.css'

const OPTIONS = [
  {
    value: 'deslizar',
    title: 'Deslizar',
    description: 'Arraste com o dedo pros lados pra trocar a vacina ativa no carrossel.',
  },
  {
    value: 'selecionar',
    title: 'Selecionar',
    description: 'Toque numa vacina do carrossel pra abrir as informações dela direto.',
  },
]

// Tela de definicoes do app. Por enquanto so tem a preferencia de como
// escolher a vacina ativa no carrossel da Contagem do Dia.
function SettingsScreen({ selectionMode, onChangeSelectionMode, onBack }) {
  return (
    <div className="settings-screen screen-enter">
      <ScreenHeader title="Definições" onBack={onBack} />

      <div className="settings-body">
        <p className="settings-section-title">Seleção de vacinas no carrossel</p>

        <div className="settings-options">
          {OPTIONS.map((option) => {
            const selected = option.value === selectionMode
            return (
              <button
                type="button"
                key={option.value}
                className={`settings-option clay-tap ${selected ? 'settings-option-selected' : ''}`}
                onClick={() => onChangeSelectionMode(option.value)}
              >
                <div className="settings-option-texts">
                  <strong>{option.title}</strong>
                  <span>{option.description}</span>
                </div>
                <span className="settings-option-check">{selected && <CheckIcon size={18} />}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen
