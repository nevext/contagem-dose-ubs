import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import VaccineCarousel from '../../components/VaccineCarousel/VaccineCarousel'
import CounterControl from '../../components/CounterControl/CounterControl'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { SyringeIcon, SearchIcon, BoxIcon, InfoIcon, ChevronRightIcon } from '../../icons'
import { formatDateBR } from '../../utils/date'
import './ContagemDoDiaScreen.css'

// Tela de uso continuo ao longo do expediente: escolhe a vacina no carrossel
// e usa o +/- para registrar doses aplicadas, com estoque calculado ao vivo.
// Cada clique no +/- pede confirmacao antes de valer, pra evitar toque errado
// bagunçando a contagem do dia.
function ContagemDoDiaScreen({
  vaccines,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  onIncrement,
  onDecrement,
  onBack,
  onOpenInfo,
  onOpenCadastro,
  onOpenSearch,
}) {
  const [pendingChange, setPendingChange] = useState(null)

  if (vaccines.length === 0) {
    return (
      <div className="contagem-dia-screen screen-enter">
        <ScreenHeader
          title="Contagem do Dia"
          subtitle="Vacinação"
          onBack={onBack}
          rightIcon={<SearchIcon size={20} />}
          rightLabel="Buscar vacina"
          onRightAction={onOpenSearch}
        />
        <div className="contagem-dia-empty">
          <span className="contagem-dia-empty-icon">
            <SyringeIcon size={30} />
          </span>
          <strong>Nenhuma vacina cadastrada</strong>
          <p>Cadastre as vacinas de hoje pra começar a contagem.</p>
          <button type="button" className="clay-tap contagem-dia-empty-button" onClick={onOpenCadastro}>
            Cadastrar vacina
          </button>
        </div>
      </div>
    )
  }

  const active = vaccines[activeIndex]
  const availableStock = active.initialStock - active.appliedToday

  const confirmChange = () => {
    if (pendingChange === 'increment') onIncrement(active.id)
    else if (pendingChange === 'decrement') onDecrement(active.id)
    setPendingChange(null)
  }

  return (
    <div className="contagem-dia-screen screen-enter">
      <ScreenHeader
        title="Contagem do Dia"
        subtitle="Vacinação"
        onBack={onBack}
        rightIcon={<SearchIcon size={20} />}
        rightLabel="Buscar vacina"
        onRightAction={onOpenSearch}
      />

      <VaccineCarousel vaccines={vaccines} activeIndex={activeIndex} onSelect={onSelect} onPrev={onPrev} onNext={onNext} />

      <section className="vaccine-detail-card pop-in" key={active.id}>
        <div className="vaccine-detail-head">
          <span className="vaccine-detail-icon">
            <SyringeIcon size={26} />
          </span>
          <div className="vaccine-detail-titles">
            <strong>{active.name}</strong>
            <span>{active.subtitle}</span>
          </div>
          <span className="vaccine-status-badge">Vacina ativa</span>
        </div>

        <div className="vaccine-detail-divider" />

        <div className="vaccine-detail-grid">
          <div>
            <span>Dose padrão</span>
            <strong>{active.dosePadrao}</strong>
          </div>
          <div>
            <span>Fabricante</span>
            <strong>{active.fabricante ?? '—'}</strong>
          </div>
          <div>
            <span>Lote atual</span>
            <strong>{active.lote}</strong>
          </div>
          <div>
            <span>Validade</span>
            <strong>{formatDateBR(active.validade)}</strong>
          </div>
        </div>

        <CounterControl
          value={active.appliedToday}
          onIncrement={() => setPendingChange('increment')}
          onDecrement={() => setPendingChange('decrement')}
        />

        <p className="vaccine-detail-last-update">Última atualização: {active.lastUsedAt ?? '--:--'}</p>

        <div className="vaccine-detail-stock-row">
          <BoxIcon size={20} />
          <div>
            <span>Estoque disponível</span>
            <strong>{availableStock} doses</strong>
          </div>
        </div>

        <button type="button" className="vaccine-detail-info-row clay-tap" onClick={() => onOpenInfo(active.id)}>
          <InfoIcon size={18} />
          <span>Ver informações da vacina</span>
          <ChevronRightIcon size={18} />
        </button>
      </section>

      <footer className="contagem-dia-footer">
        <strong>USF</strong>
        <span>Unidade de Saúde da Família</span>
      </footer>

      <ConfirmDialog
        open={pendingChange !== null}
        title="Tem certeza?"
        message={
          pendingChange === 'increment'
            ? `Confirmar +1 dose aplicada de ${active.name}?`
            : `Confirmar -1 dose de ${active.name}? Isso corrige a contagem de hoje.`
        }
        confirmLabel="Confirmar"
        onConfirm={confirmChange}
        onCancel={() => setPendingChange(null)}
      />
    </div>
  )
}

export default ContagemDoDiaScreen
