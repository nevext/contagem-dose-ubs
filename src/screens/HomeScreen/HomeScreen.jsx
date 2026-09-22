import NavCard from '../../components/NavCard/NavCard'
import { SyringeIcon, MonitorIcon, DocumentIcon, CalendarIcon, GearIcon } from '../../icons'
import { APP_VERSION } from '../../utils/version'
import './HomeScreen.css'

// Menu principal da unidade. Vacinacao e a unica secao funcional por enquanto,
// as outras tres aparecem desabilitadas com "Em breve" ate entrarem no escopo.
function HomeScreen({ onOpenVacinacao, onOpenSettings }) {
  return (
    <div className="home-screen screen-enter">
      <div className="home-topbar">
        <span className="home-brand-mark">
          <img src="/brasao.png" alt="USF" width={32} height={32} style={{objectFit: 'contain'}} />
        </span>
        <div className="home-brand-texts">
          <strong>USF</strong>
          <span>Unidade de Saúde da Família</span>
        </div>
        <button type="button" className="clay-icon-button clay-tap" onClick={onOpenSettings} aria-label="Definições">
          <GearIcon size={20} />
        </button>
      </div>

      <div className="home-hero">
        <span className="home-hero-mark">
          <img src="/brasao.png" alt="USF" width={100} height={100} style={{objectFit: 'contain'}} />
        </span>
        <h1>USF</h1>
        <p>Unidade de Saúde da Família</p>
        <p>Lindalva Damasceno</p>
      </div>

      <nav className="home-nav-list">
        <NavCard
          icon={<SyringeIcon size={24} />}
          title="Vacinação"
          subtitle="Registro e acompanhamento"
          onClick={onOpenVacinacao}
        />
        <NavCard
          icon={<MonitorIcon size={24} />}
          title="Manutenção de Equipamentos"
          subtitle="Em breve"
          disabled
        />
        <NavCard
          icon={<DocumentIcon size={24} />}
          title="Organização de Informações"
          subtitle="Em breve"
          disabled
        />
        <NavCard
          icon={<CalendarIcon size={24} />}
          title="Agenda de Atendimento"
          subtitle="Em breve"
          disabled
        />
      </nav>

      <footer className="home-footer">
        <p>Cuidando da nossa comunidade com responsabilidade e eficiência.</p>
        <span>v{APP_VERSION}</span>
      </footer>
    </div>
  )
}

export default HomeScreen
