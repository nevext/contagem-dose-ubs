import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import VaccineCarousel from '../../components/VaccineCarousel/VaccineCarousel'
import CounterControl from '../../components/CounterControl/CounterControl'
import { SyringeIcon, CalendarIcon, BoxIcon, ClockIcon, InfoIcon, ChevronRightIcon } from '../../icons'
import './ContagemDoDiaScreen.css'

// Tela de uso continuo ao longo do expediente: escolhe a vacina no carrossel
// e usa o +/- para registrar doses aplicadas, com estoque calculado ao vivo.
function ContagemDoDiaScreen({ vaccines, activeIndex, onSelect, onPrev, onNext, onIncrement, onDecrement, onBack }) {
  const active = vaccines[activeIndex]
  const availableStock = active.initialStock - active.appliedToday

  return (
    <div className="contagem-dia-screen">
      <ScreenHeader
        title="Contagem do Dia"
        subtitle="Vacinação"
        onBack={onBack}
        rightIcon={<CalendarIcon size={20} />}
      />

      <VaccineCarousel
        vaccines={vaccines}
        activeIndex={activeIndex}
        onSelect={onSelect}
        onPrev={onPrev}
        onNext={onNext}
      />

      <section className="vaccine-detail-card">
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
            <span>Lote atual</span>
            <strong>{active.lote}</strong>
          </div>
          <div>
            <span>Validade</span>
            <strong>{active.validade}</strong>
          </div>
        </div>

        <CounterControl
          value={active.appliedToday}
          onIncrement={() => onIncrement(active.id)}
          onDecrement={() => onDecrement(active.id)}
        />

        <div className="vaccine-detail-footer-grid">
          <div>
            <BoxIcon size={20} />
            <div>
              <span>Estoque disponível</span>
              <strong>{availableStock} doses</strong>
            </div>
          </div>
          <div>
            <ClockIcon size={20} />
            <div>
              <span>Última utilização</span>
              <strong>{active.lastUsedAt ?? '--:--'}</strong>
            </div>
          </div>
        </div>

        <div className="vaccine-detail-info-row">
          <InfoIcon size={18} />
          <span>Ver informações da vacina</span>
          <ChevronRightIcon size={18} />
        </div>
      </section>

      <footer className="contagem-dia-footer">
        <strong>USF</strong>
        <span>Unidade de Saúde da Família</span>
      </footer>
    </div>
  )
}

export default ContagemDoDiaScreen
