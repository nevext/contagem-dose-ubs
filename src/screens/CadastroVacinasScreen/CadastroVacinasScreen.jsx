import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { SyringeIcon, EditIcon, TrashIcon, PlusIcon } from '../../icons'
import { totalDoses } from '../../utils/vaccine'
import './CadastroVacinasScreen.css'

// Tela usada uma vez pela manha (ou quando chega uma vacina nova) pra
// avisar o sistema quais vacinas existem hoje e quanto tem de cada uma.
// Adicionar e editar abrem a tela dedicada (VaccineFormScreen) em vez de um
// formulario embutido aqui, pra ter espaco pras informacoes detalhadas e pra
// sempre ter um cabecalho com botao de voltar de verdade.
function CadastroVacinasScreen({ vaccines, onRemove, onOpenNew, onOpenEdit, onBack }) {
  const [vaccineToRemove, setVaccineToRemove] = useState(null)

  const confirmRemove = () => {
    onRemove(vaccineToRemove.id)
    setVaccineToRemove(null)
  }

  return (
    <div className="cadastro-screen screen-enter">
      <ScreenHeader title="Cadastro de Vacinas" subtitle="Vacinação" onBack={onBack} />

      <div className="cadastro-body">
        <button type="button" className="cadastro-add-button clay-tap" onClick={onOpenNew}>
          <span className="cadastro-add-icon">
            <PlusIcon size={20} />
          </span>
          Adicionar vacina
        </button>

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
                  <span>
                    {vaccine.frascos} frasco{vaccine.frascos === 1 ? '' : 's'}
                    {vaccine.dosesPorFrasco > 1 ? ` (${vaccine.dosesPorFrasco} doses cada)` : ''} · {totalDoses(vaccine)} doses no estoque
                  </span>
                </div>
                <button type="button" className="clay-icon-button clay-tap" onClick={() => onOpenEdit(vaccine.id)} aria-label={`Editar ${vaccine.name}`}>
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
