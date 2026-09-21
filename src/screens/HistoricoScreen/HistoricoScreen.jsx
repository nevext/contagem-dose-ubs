import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { HistoryIcon, CheckIcon, AlertIcon, ChevronRightIcon } from '../../icons'
import './HistoricoScreen.css'

function formatDate(isoDate) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(`${isoDate}T12:00:00`))
}

// Lista os dias ja finalizados, do mais recente pro mais antigo. Clicar num
// dia mostra o detalhe: doses aplicadas por vacina e o resultado da
// comparacao daquele fechamento.
function HistoricoScreen({ history, onBack }) {
  const [selectedId, setSelectedId] = useState(null)
  const selected = history.find((record) => record.id === selectedId)

  if (selected) {
    const divergent = selected.entries.filter((entry) => entry.diff !== 0)
    return (
      <div className="historico-screen screen-enter">
        <ScreenHeader title={formatDate(selected.date)} subtitle="Histórico" onBack={() => setSelectedId(null)} />
        <div className="historico-detail-body">
          <div className={`historico-detail-summary ${divergent.length === 0 ? 'historico-detail-summary-ok' : 'historico-detail-summary-bad'}`}>
            {divergent.length === 0 ? <CheckIcon size={18} /> : <AlertIcon size={18} />}
            <span>{divergent.length === 0 ? 'Bateu certinho em todas as vacinas' : `${divergent.length} vacina${divergent.length === 1 ? '' : 's'} com divergência`}</span>
          </div>

          <ul className="historico-entry-list">
            {selected.entries.map((entry) => (
              <li className="historico-entry" key={entry.id}>
                <div className="historico-entry-head">
                  <strong>{entry.name}</strong>
                  <span className={entry.diff === 0 ? 'historico-entry-ok' : 'historico-entry-bad'}>
                    {entry.diff === 0 ? 'OK' : `${Math.abs(entry.diff)} sem explicação`}
                  </span>
                </div>
                <div className="historico-entry-numbers">
                  <div>
                    <span>Esperado</span>
                    <strong>{entry.expected}</strong>
                  </div>
                  <div>
                    <span>Contado</span>
                    <strong>{entry.counted}</strong>
                  </div>
                  <div>
                    <span>Diferença</span>
                    <strong>{entry.diff}</strong>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="historico-screen screen-enter">
      <ScreenHeader title="Histórico" subtitle="Vacinação" onBack={onBack} />

      <div className="historico-body">
        {history.length === 0 ? (
          <div className="historico-empty">
            <span className="historico-empty-icon">
              <HistoryIcon size={30} />
            </span>
            <strong>Nenhum dia finalizado ainda</strong>
            <p>Assim que você concluir um dia em "Finalizar o Dia", ele aparece aqui.</p>
          </div>
        ) : (
          <ul className="historico-list">
            {history.map((record) => {
              const divergent = record.entries.filter((entry) => entry.diff !== 0).length
              return (
                <li key={record.id}>
                  <button type="button" className="historico-item clay-tap" onClick={() => setSelectedId(record.id)}>
                    <div className="historico-item-texts">
                      <strong>{formatDate(record.date)}</strong>
                      <span>{record.entries.length} vacina{record.entries.length === 1 ? '' : 's'} conferida{record.entries.length === 1 ? '' : 's'}</span>
                    </div>
                    <span className={`historico-item-badge ${divergent === 0 ? 'historico-item-badge-ok' : 'historico-item-badge-bad'}`}>
                      {divergent === 0 ? 'Sem divergência' : `${divergent} divergência${divergent === 1 ? '' : 's'}`}
                    </span>
                    <ChevronRightIcon size={18} />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HistoricoScreen
