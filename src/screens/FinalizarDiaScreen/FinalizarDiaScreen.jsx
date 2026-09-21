import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { ClipboardIcon, CheckIcon, AlertIcon, CalendarIcon } from '../../icons'
import { totalDoses } from '../../utils/vaccine'
import './FinalizarDiaScreen.css'

// Tela que resolve o problema principal do projeto: compara o estoque
// esperado (inicial menos doses aplicadas) com o que foi contado fisicamente
// no fim do expediente, e aponta a divergencia vacina por vacina.
function FinalizarDiaScreen({ vaccines, onFinalize, onBack }) {
  const [counts, setCounts] = useState({})
  const [calculated, setCalculated] = useState(false)
  const [confirmingFinish, setConfirmingFinish] = useState(false)

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())
  const totalAppliedToday = vaccines.reduce((sum, vaccine) => sum + vaccine.appliedToday, 0)

  const allFilled = vaccines.length > 0 && vaccines.every((vaccine) => counts[vaccine.id] !== undefined && counts[vaccine.id] !== '')

  const setCount = (id, value) => {
    setCounts((current) => ({ ...current, [id]: value }))
    setCalculated(false)
  }

  const results = vaccines.map((vaccine) => {
    const expected = totalDoses(vaccine) - vaccine.appliedToday
    const counted = Number(counts[vaccine.id])
    const diff = expected - counted
    return { id: vaccine.id, name: vaccine.name, expected, counted, diff }
  })

  const okCount = results.filter((result) => result.diff === 0).length
  const divergentCount = results.length - okCount

  const handleCalculate = () => {
    if (!allFilled) return
    setCalculated(true)
  }

  const handleFinish = () => {
    onFinalize(results)
    setConfirmingFinish(false)
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
        <div className="finalizar-date">
          <CalendarIcon size={18} />
          <span>{formattedDate}</span>
        </div>

        <p className="finalizar-summary">
          {vaccines.length} vacina{vaccines.length === 1 ? '' : 's'} cadastrada{vaccines.length === 1 ? '' : 's'} hoje, {totalAppliedToday} dose{totalAppliedToday === 1 ? '' : 's'} aplicada{totalAppliedToday === 1 ? '' : 's'} no total
        </p>

        <ul className="finalizar-list">
          {vaccines.map((vaccine) => {
            const result = results.find((item) => item.id === vaccine.id)
            return (
              <li className="finalizar-item" key={vaccine.id}>
                <strong className="finalizar-item-name">{vaccine.name}</strong>

                <div className="finalizar-item-grid">
                  <div>
                    <span>Estoque inicial</span>
                    <strong>{totalDoses(vaccine)}</strong>
                  </div>
                  <div>
                    <span>Doses aplicadas</span>
                    <strong>{vaccine.appliedToday}</strong>
                  </div>
                  <div>
                    <span>Estoque esperado</span>
                    <strong>{result.expected}</strong>
                  </div>
                </div>

                <label className="finalizar-item-field">
                  <span>Quantidade contada fisicamente no estoque</span>
                  <input
                    type="number"
                    min="0"
                    value={counts[vaccine.id] ?? ''}
                    onChange={(event) => setCount(vaccine.id, event.target.value)}
                    placeholder="Ex: 22"
                  />
                </label>

                {calculated && (
                  <div className={`finalizar-result ${result.diff === 0 ? 'finalizar-result-ok' : 'finalizar-result-bad'}`}>
                    <div className="finalizar-result-numbers">
                      <div>
                        <span>Estoque esperado</span>
                        <strong>{result.expected}</strong>
                      </div>
                      <div>
                        <span>Estoque contado</span>
                        <strong>{result.counted}</strong>
                      </div>
                      <div>
                        <span>Diferença</span>
                        <strong>{result.diff}</strong>
                      </div>
                    </div>
                    <div className="finalizar-result-status">
                      {result.diff === 0 ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
                      <span>
                        {result.diff === 0
                          ? 'Bateu certinho'
                          : result.diff > 0
                            ? `Faltam ${result.diff} dose${result.diff === 1 ? '' : 's'}`
                            : `Sobraram ${Math.abs(result.diff)} dose${Math.abs(result.diff) === 1 ? '' : 's'}`}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {calculated && (
          <div className="finalizar-final-summary">
            <div className="finalizar-final-summary-item finalizar-final-summary-ok">
              <strong>{okCount}</strong>
              <span>sem divergência</span>
            </div>
            <div className="finalizar-final-summary-item finalizar-final-summary-bad">
              <strong>{divergentCount}</strong>
              <span>com divergência</span>
            </div>
          </div>
        )}

        <div className="finalizar-actions">
          {!calculated ? (
            <button type="button" className="finalizar-calc-button clay-tap" onClick={handleCalculate} disabled={!allFilled}>
              Calcular divergência
            </button>
          ) : (
            <button type="button" className="finalizar-calc-button clay-tap" onClick={() => setConfirmingFinish(true)}>
              Salvar e encerrar o dia
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmingFinish}
        title="Encerrar o dia"
        message="Isso vai fechar o registro de hoje e guardar o resultado no histórico. Depois de encerrado não dá mais pra voltar e corrigir a contagem de hoje."
        confirmLabel="Salvar e encerrar"
        danger
        onConfirm={handleFinish}
        onCancel={() => setConfirmingFinish(false)}
      />
    </div>
  )
}

export default FinalizarDiaScreen
