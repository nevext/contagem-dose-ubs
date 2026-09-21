import { useRef, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { SyringeIcon, EditIcon, TrashIcon } from '../../icons'
import './CadastroVacinasScreen.css'

const emptyForm = { name: '', initialStock: '' }

// Tela usada uma vez pela manha (ou quando chega uma vacina nova) pra
// avisar o sistema quais vacinas existem hoje e quanto tem de cada uma.
function CadastroVacinasScreen({ vaccines, onAdd, onUpdate, onRemove, onBack }) {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [vaccineToRemove, setVaccineToRemove] = useState(null)
  const formRef = useRef(null)

  const isEditing = editingId !== null

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const initialStock = Number(form.initialStock)
    if (!name || !Number.isFinite(initialStock) || initialStock < 0) return

    if (isEditing) {
      onUpdate(editingId, { name, initialStock })
    } else {
      onAdd({ name, initialStock })
    }
    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (vaccine) => {
    setEditingId(vaccine.id)
    setForm({ name: vaccine.name, initialStock: String(vaccine.initialStock) })
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const confirmRemove = () => {
    if (editingId === vaccineToRemove.id) cancelEdit()
    onRemove(vaccineToRemove.id)
    setVaccineToRemove(null)
  }

  return (
    <div className="cadastro-screen screen-enter">
      <ScreenHeader title="Cadastro de Vacinas" subtitle="Vacinação" onBack={onBack} />

      <div className="cadastro-body">
        <form className="cadastro-form" ref={formRef} onSubmit={handleSubmit}>
          <label className="cadastro-field">
            <span>Nome da vacina</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ex: Gripe"
            />
          </label>

          <label className="cadastro-field">
            <span>Quantidade inicial em estoque</span>
            <input
              type="number"
              min="0"
              value={form.initialStock}
              onChange={(event) => setForm((current) => ({ ...current, initialStock: event.target.value }))}
              placeholder="Ex: 40"
            />
          </label>

          <div className="cadastro-form-actions">
            {isEditing && (
              <button type="button" className="cadastro-cancel-button clay-tap" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
            <button type="submit" className="cadastro-submit-button clay-tap">
              {isEditing ? 'Salvar alteração' : 'Adicionar vacina'}
            </button>
          </div>
        </form>

        <p className="cadastro-list-title">Vacinas cadastradas</p>

        {vaccines.length === 0 ? (
          <p className="cadastro-empty">Nenhuma vacina cadastrada ainda.</p>
        ) : (
          <ul className="cadastro-list">
            {vaccines.map((vaccine) => (
              <li className="cadastro-item" key={vaccine.id}>
                <span className="cadastro-item-icon">
                  <SyringeIcon size={22} />
                </span>
                <div className="cadastro-item-texts">
                  <strong>{vaccine.name}</strong>
                  <span>{vaccine.initialStock} doses no estoque inicial</span>
                </div>
                <button type="button" className="clay-icon-button clay-tap" onClick={() => startEdit(vaccine)} aria-label={`Editar ${vaccine.name}`}>
                  <EditIcon size={18} />
                </button>
                <button type="button" className="clay-icon-button clay-tap" onClick={() => setVaccineToRemove(vaccine)} aria-label={`Remover ${vaccine.name}`}>
                  <TrashIcon size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={vaccineToRemove !== null}
        title="Remover vacina"
        message={vaccineToRemove ? `Remover "${vaccineToRemove.name}" da contagem de hoje? Isso apaga as doses já aplicadas dela hoje.` : ''}
        confirmLabel="Remover"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setVaccineToRemove(null)}
      />
    </div>
  )
}

export default CadastroVacinasScreen
