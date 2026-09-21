import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { ClipboardIcon, CheckIcon, AlertIcon } from '../../icons'
import './FinalizarDiaScreen.css'

// Tela que resolve o problema principal do projeto: compara o estoque
// esperado (inicial menos doses aplicadas) com o que foi contado fisicamente
// no fim do expediente, e aponta a divergencia vacina por vacina.
function FinalizarDiaScreen({ vaccines, onFinalize, onBack }) {
  const [counts, setCounts] = useState({})
  const [calculated, setCalculated] = useState(false)

  const allFilled = vaccines.length > 0 && vaccines.every((vaccine) => counts[vaccine.id] !== undefined && counts[vaccine.id] !== '')

  const setCount = (id, value) => {
    setCounts((current) => ({ ...current, [id]: value }))
    setCalculated(false)
  }

  const results = vaccines.map((vaccine) => {
    const expected = vaccine.initialStock - vaccine.appliedToday
    const counted = Number(counts[vaccine.id])
    const diff = expected - counted
    return { id: vaccine.id, name: vaccine.name, expected, counted, diff }
  })

  const handleCalculate = () => {
    if (!allFilled) return
    setCalculated(true)
  }

  const handleFinish = () => {
    onFinalize(results)
  }

  if (vaccines.length === 0) {
    return (
      <div className="finalizar-screen screen-enter">
        <ScreenHeader title="Finalizar o Dia" subtitle="Vacinação" onBack={onBack} />
        <div className="finalizar-empty">
          <span className="finalizar-empty-icon">
            <ClipboardIcon size={30} />
          </span>
          <strong>Nenhuma vacina cadastrada hoje</strong>
          <p>Cadastre as vacinas do dia antes de fechar a contagem.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="finalizar-screen screen-enter">
      <ScreenHeader title="Finalizar o Dia" subtitle="Vacinação" onBack={onBack} />

      <div className="finalizar-body">
        <ul className="finalizar-list">
          {vaccines.map((vaccine) => (
            <li className="finalizar-item" key={vaccine.id}>
              <div className="finalizar-item-head">
                <strong>{vaccine.name}</strong>
                <span>{vaccine.appliedToday} doses aplicadas hoje</span>
              </div>

              <label className="finalizar-item-field">
                <span>Quantidade contada no estoque físico</span>
                <input
                  type="number"
                  min="0"
                  value={counts[vaccine.id] ?? ''}
                  onChange={(event) => setCount(vaccine.id, event.target.value)}
                  placeholder="Ex: 22"
                />
              </label>

              {calculated && (
                <div className={`finalizar-result ${results.find((r) => r.id === vaccine.id).diff === 0 ? 'finalizar-result-ok' : 'finalizar-result-bad'}`}>
                  {(() => {
                    const result = results.find((r) => r.id === vaccine.id)
                    return (
                      <>
                        <div className="finalizar-result-numbers">
                          <div>
                            <span>Esperado</span>
                            <strong>{result.expected}</strong>
                          </div>
                          <div>
                            <span>Contado</span>
                            <strong>{result.counted}</strong>
                          </div>
                          <div>
                            <span>Diferença</span>
                            <strong>{result.diff}</strong>
                          </div>
                        </div>
                        <div className="finalizar-result-status">
                          {result.diff === 0 ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
                          <span>{result.diff === 0 ? 'OK, bateu certinho' : `${Math.abs(result.diff)} dose${Math.abs(result.diff) === 1 ? '' : 's'} sem explicação`}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="finalizar-actions">
          {!calculated ? (
            <button type="button" className="finalizar-calc-button clay-tap" onClick={handleCalculate} disabled={!allFilled}>
              Calcular
            </button>
          ) : (
            <button type="button" className="finalizar-calc-button clay-tap" onClick={handleFinish}>
              Concluir o dia
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FinalizarDiaScreen
