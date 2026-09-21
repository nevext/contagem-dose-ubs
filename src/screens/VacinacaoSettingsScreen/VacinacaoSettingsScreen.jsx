import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { CheckIcon } from '../../icons'
import './VacinacaoSettingsScreen.css'

const OPTIONS = [
  {
    value: 'deslizar',
    title: 'Deslizar',
    description: 'Arraste com o dedo pros lados pra girar a roda e trocar a vacina ativa.',
  },
  {
    value: 'selecionar',
    title: 'Selecionar',
    description: 'Toque numa vacina da roda pra abrir as informações dela direto.',
  },
]

// Definicoes especificas da secao Vacinacao, acessadas pelo menu "..." no
// cabecalho. Por enquanto so tem a preferencia de selecao no carrossel, mas
// e aqui que futuras configuracoes dessa secao (alertas de estoque baixo,
// confirmacao antes de finalizar o dia, etc.) devem entrar.
function VacinacaoSettingsScreen({ selectionMode, onChangeSelectionMode, onBack }) {
  return (
    <div className="vac-settings-screen screen-enter">
      <ScreenHeader title="Definições" subtitle="Vacinação" onBack={onBack} />

      <div className="vac-settings-body">
        <p className="vac-settings-section-title">Seleção de vacinas na roda</p>

        <div className="vac-settings-options">
          {OPTIONS.map((option) => {
            const selected = option.value === selectionMode
            return (
              <button
                type="button"
                key={option.value}
                className={`vac-settings-option clay-tap ${selected ? 'vac-settings-option-selected' : ''}`}
                onClick={() => onChangeSelectionMode(option.value)}
              >
                <div className="vac-settings-option-texts">
                  <strong>{option.title}</strong>
                  <span>{option.description}</span>
                </div>
                <span className="vac-settings-option-check">{selected && <CheckIcon size={18} />}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VacinacaoSettingsScreen
