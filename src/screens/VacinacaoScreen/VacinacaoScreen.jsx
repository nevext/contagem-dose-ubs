import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import NavCard from '../../components/NavCard/NavCard'
import { SyringeIcon, ClipboardIcon, HistoryIcon, CalendarIcon, DotsIcon } from '../../icons'
import './VacinacaoScreen.css'

// Menu da secao Vacinacao: resumo do dia + acesso as sub-telas.
function VacinacaoScreen({
  totalAppliedToday,
  formattedDate,
  onBack,
  onOpenContagem,
  onOpenCadastro,
  onOpenFinalizar,
  onOpenHistorico,
  onOpenSettings,
}) {
  return (
    <div className="vacinacao-screen screen-enter">
      <ScreenHeader title="Vacinação" onBack={onBack} rightIcon={<DotsIcon size={22} />} onRightAction={onOpenSettings} />

      <div className="vacinacao-date">
        <CalendarIcon size={18} />
        <span>{formattedDate}</span>
      </div>

      <button type="button" className="contagem-summary-card clay-tap" onClick={onOpenContagem}>
        <div className="contagem-summary-texts">
          <span className="contagem-summary-label">Contagem do dia</span>
          <strong className="contagem-summary-value">{totalAppliedToday}</strong>
          <span className="contagem-summary-caption">vacinas aplicadas</span>
        </div>
        <span className="contagem-summary-icon">
          <SyringeIcon size={30} />
        </span>
      </button>

      <nav className="vacinacao-nav-list">
        <NavCard
          icon={<SyringeIcon size={24} />}
          title="Cadastro de Vacinas"
          subtitle="Cadastrar e atualizar vacinas"
          onClick={onOpenCadastro}
        />
        <NavCard
          icon={<ClipboardIcon size={24} />}
          title="Finalizar o Dia"
          subtitle="Visualizar o resumo e o log do dia"
          onClick={onOpenFinalizar}
        />
        <NavCard
          icon={<HistoryIcon size={24} />}
          title="Histórico"
          subtitle="Consultar registros anteriores"
          onClick={onOpenHistorico}
        />
      </nav>

      <footer className="vacinacao-footer">
        <span className="vacinacao-footer-line" aria-hidden="true" />
        <div>
          <strong>USF</strong>
          <span>Unidade de Saúde da Família</span>
        </div>
      </footer>
    </div>
  )
}

export default VacinacaoScreen
