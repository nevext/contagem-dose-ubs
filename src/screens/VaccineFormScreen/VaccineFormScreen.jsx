import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import ClayDatePicker from '../../components/ClayDatePicker/ClayDatePicker'
import './VaccineFormScreen.css'

const emptyForm = { name: '', frascos: '', dosesPorFrasco: '', dosePadrao: '', fabricante: '', lote: '', validade: '' }

// Tela dedicada de cadastro/edicao de vacina, com as informacoes detalhadas
// (dose padrao, lote, validade) que antes so apareciam como "—" na Contagem
// do Dia porque o cadastro nao coletava esses dados.
function VaccineFormScreen({ vaccine, onSave, onBack }) {
  const isEditing = Boolean(vaccine)
  const [form, setForm] = useState(() =>
    isEditing
      ? {
          name: vaccine.name,
          frascos: String(vaccine.frascos),
          dosesPorFrasco: String(vaccine.dosesPorFrasco),
          dosePadrao: vaccine.dosePadrao ?? '',
          fabricante: vaccine.fabricante && vaccine.fabricante !== '—' ? vaccine.fabricante : '',
          lote: vaccine.lote && vaccine.lote !== '—' ? vaccine.lote : '',
          validade: vaccine.validade ?? '',
        }
      : emptyForm,
  )

  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const frascos = Number(form.frascos)
    const dosesPorFrasco = form.dosesPorFrasco.trim() ? Number(form.dosesPorFrasco) : 1
    if (!name || !Number.isFinite(frascos) || frascos < 0) return
    if (!Number.isFinite(dosesPorFrasco) || dosesPorFrasco < 1) return

    onSave({
      name,
      frascos,
      dosesPorFrasco,
      dosePadrao: form.dosePadrao.trim() || '1 dose',
      fabricante: form.fabricante.trim() || '—',
      lote: form.lote.trim() || '—',
      validade: form.validade || '',
    })
  }

  return (
    <div className="vaccine-form-screen screen-enter">
      <ScreenHeader title={isEditing ? 'Editar Vacina' : 'Nova Vacina'} subtitle="Cadastro de Vacinas" onBack={onBack} />

      <form className="vaccine-form-body" onSubmit={handleSubmit}>
        <label className="vaccine-form-field">
          <span>Nome da vacina</span>
          <input type="text" value={form.name} onChange={setField('name')} placeholder="Ex: Gripe" />
        </label>

        <div className="vaccine-form-row">
          <label className="vaccine-form-field">
            <span>Frascos em estoque</span>
            <input type="number" min="0" value={form.frascos} onChange={setField('frascos')} placeholder="Ex: 10" />
          </label>

          <label className="vaccine-form-field">
            <span>Doses por frasco</span>
            <input type="number" min="1" value={form.dosesPorFrasco} onChange={setField('dosesPorFrasco')} placeholder="Ex: 1" />
          </label>
        </div>
        <p className="vaccine-form-hint">
          Vacina de dose única: deixa "Doses por frasco" em 1. Frasco multi-dose (ex: febre amarela): coloca quantas
          doses saem de cada frasco (ex: 4) — a contagem do dia continua sendo por dose aplicada.
        </p>

        <p className="vaccine-form-section-title">Informações detalhadas (opcional)</p>

        <label className="vaccine-form-field">
          <span>Dose padrão</span>
          <input type="text" value={form.dosePadrao} onChange={setField('dosePadrao')} placeholder="Ex: 1 dose" />
        </label>

        <label className="vaccine-form-field">
          <span>Fabricante</span>
          <input type="text" value={form.fabricante} onChange={setField('fabricante')} placeholder="Ex: Butantan" />
        </label>

        <label className="vaccine-form-field">
          <span>Lote atual</span>
          <input type="text" value={form.lote} onChange={setField('lote')} placeholder="Ex: AB1234" />
        </label>

        <div className="vaccine-form-field">
          <span>Validade</span>
          <ClayDatePicker value={form.validade} onChange={(iso) => setForm((current) => ({ ...current, validade: iso }))} placeholder="Selecionar validade" />
        </div>

        <button type="submit" className="vaccine-form-submit clay-tap">
          {isEditing ? 'Salvar alterações' : 'Adicionar vacina'}
        </button>
      </form>
    </div>
  )
}

export default VaccineFormScreen
