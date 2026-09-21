import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { SyringeIcon, BoxIcon, ClockIcon } from '../../icons'
import './VaccineInfoScreen.css'

// Leitura detalhada de uma vacina, acessada pelo "Ver informacoes da vacina"
// ou, no modo de selecao por toque, ao tocar direto no card do carrossel.
function VaccineInfoScreen({ vaccine, onBack }) {
  const availableStock = vaccine.initialStock - vaccine.appliedToday

  return (
    <div className="vaccine-info-screen screen-enter">
      <ScreenHeader title="Informações da Vacina" subtitle={vaccine.name} onBack={onBack} />

      <div className="vaccine-info-body">
        <div className="vaccine-info-head">
          <span className="vaccine-info-icon">
            <SyringeIcon size={30} />
          </span>
          <div>
            <strong>{vaccine.name}</strong>
            <span>{vaccine.subtitle}</span>
          </div>
        </div>

        <div className="vaccine-info-card">
          <div className="vaccine-info-row">
            <span>Dose padrão</span>
            <strong>{vaccine.dosePadrao}</strong>
          </div>
          <div className="vaccine-info-row">
            <span>Lote atual</span>
            <strong>{vaccine.lote}</strong>
          </div>
          <div className="vaccine-info-row">
            <span>Validade</span>
            <strong>{vaccine.validade}</strong>
          </div>
          <div className="vaccine-info-row">
            <span>Estoque inicial de hoje</span>
            <strong>{vaccine.initialStock} doses</strong>
          </div>
          <div className="vaccine-info-row">
            <span>Aplicadas hoje</span>
            <strong>{vaccine.appliedToday} doses</strong>
          </div>
        </div>

        <div className="vaccine-info-footer-grid">
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
              <strong>{vaccine.lastUsedAt ?? '--:--'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VaccineInfoScreen
