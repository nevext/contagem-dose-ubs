import { useState } from 'react'

function CadastroVacina({ onAdd }) {
  const [name, setName] = useState('')
  const [initialStock, setInitialStock] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim() || initialStock === '') return

    onAdd({ name, initialStock: Number(initialStock) })
    setName('')
    setInitialStock('')
  }

  return (
    <form className="add-vaccine-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <span className="step-number">01</span>
        <div>
          <h2>Adicionar vacina</h2>
          <p>Cadastre o estoque disponível no início do dia.</p>
        </div>
      </div>
      <div className="form-fields">
        <label>
          Nome da vacina
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Influenza" required />
        </label>
        <label>
          Estoque inicial
          <input type="number" min="0" step="1" value={initialStock} onChange={(event) => setInitialStock(event.target.value)} placeholder="0" required />
        </label>
        <button type="submit" className="add-button"><span aria-hidden="true">+</span> Adicionar vacina</button>
      </div>
    </form>
  )
}

export default CadastroVacina