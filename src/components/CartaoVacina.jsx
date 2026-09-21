function CartaoVacina({ vaccine, onChangeDoses }) {
  const remaining = vaccine.initialStock - vaccine.appliedDoses

  return (
    <article className="vaccine-card">
      <div className="vaccine-card-top">
        <div>
          <p className="card-label">Vacina cadastrada</p>
          <h2>{vaccine.name}</h2>
        </div>
        <span className="remaining-badge">{remaining} restantes</span>
      </div>
      <div className="dose-counter">
        <div className="dose-number" aria-live="polite">{vaccine.appliedDoses}</div>
        <span>doses aplicadas</span>
      </div>
      <div className="dose-actions">
        <button type="button" className="minus-button" onClick={() => onChangeDoses(vaccine.id, -1)} aria-label={`Corrigir uma dose de ${vaccine.name}`} disabled={vaccine.appliedDoses === 0}>−1</button>
        <button type="button" className="dose-button" onClick={() => onChangeDoses(vaccine.id, 1)}><span aria-hidden="true">+</span>1 dose aplicada</button>
      </div>
    </article>
  )
}

export default CartaoVacina