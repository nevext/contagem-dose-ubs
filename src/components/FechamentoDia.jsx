import { useState } from 'react'

function FechamentoDia({ vaccines, onCancel, onFinish }) {
  const [physicalStock, setPhysicalStock] = useState(() => Object.fromEntries(vaccines.map((vaccine) => [vaccine.id, ''])))
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const updateStock = (id, value) => setPhysicalStock((current) => ({ ...current, [id]: value }))
  const allFilled = vaccines.every((vaccine) => physicalStock[vaccine.id] !== '')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!allFilled) {
      setHasSubmitted(true)
      return
    }

    if (!hasSubmitted) {
      setHasSubmitted(true)
      return
    }

    onFinish(Object.fromEntries(Object.entries(physicalStock).map(([id, value]) => [id, Number(value)])))
  }

  return (
    <section className="closing-page" aria-labelledby="closing-title">
        <div className="modal-header">
          <div>
            <p className="section-kicker">02 · Conferência</p>
            <h2 id="closing-title">Fechar o dia</h2>
            <p className="muted-text">Conte as unidades que sobraram fisicamente no estoque.</p>
          </div>
          <button type="button" className="close-button" onClick={onCancel} aria-label="Voltar">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="stock-fields">
            {vaccines.map((vaccine) => {
              const difference = physicalStock[vaccine.id] === '' ? null : vaccine.initialStock - vaccine.appliedDoses - Number(physicalStock[vaccine.id])
              return (
                <label className="stock-row" key={vaccine.id}>
                  <span><strong>{vaccine.name}</strong><small>Esperado: {vaccine.initialStock - vaccine.appliedDoses}</small></span>
                  <input type="number" min="0" step="1" value={physicalStock[vaccine.id]} onChange={(event) => updateStock(vaccine.id, event.target.value)} placeholder="0" required />
                  {difference !== null && <span className={`difference-preview ${difference === 0 ? 'is-ok' : 'has-divergence'}`}>{difference === 0 ? 'OK' : `${difference > 0 ? '+' : ''}${difference}`}</span>}
                </label>
              )
            })}
          </div>
          {hasSubmitted && !allFilled && <p className="validation-message">Preencha a quantidade física de todas as vacinas.</p>}
          {hasSubmitted && allFilled && (
            <div className="comparison-summary" aria-live="polite">
              <strong>Resultado da conferência</strong>
              <span>Estoque esperado menos estoque físico contado</span>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onCancel}>Voltar</button>
            <button type="submit" className="primary-button">{hasSubmitted && allFilled ? 'Salvar fechamento' : 'Conferir estoque'}</button>
          </div>
        </form>
    </section>
  )
}

export default FechamentoDia