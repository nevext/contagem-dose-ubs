import NavCard from '../../components/NavCard/NavCard'
import { SyringeIcon, MonitorIcon, DocumentIcon, CalendarIcon, PersonIcon, HealthMarkIcon } from '../../icons'
import './HomeScreen.css'

// Menu principal da unidade. Vacinacao e a unica secao funcional por enquanto,
// as outras tres aparecem desabilitadas com "Em breve" ate entrarem no escopo.
function HomeScreen({ onOpenVacinacao }) {
  return (
    <div className="home-screen">
      <div className="home-topbar">
        <span className="home-brand-mark">
          <HealthMarkIcon size={22} />
        </span>
        <div className="home-brand-texts">
          <strong>USF Tarumã</strong>
          <span>Unidade de Saúde da Família</span>
        </div>
        <button type="button" className="clay-icon-button" aria-label="Perfil">
          <PersonIcon size={20} />
        </button>
      </div>

      <div className="home-hero">
        <span className="home-hero-mark">
          <HealthMarkIcon size={56} />
        </span>
        <h1>USF</h1>
        <p>Unidade de Saúde da Família</p>
      </div>

      <nav className="home-nav-list">
        <NavCard
          variant="featured"
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
        <span>v1.0</span>
      </footer>
    </div>
  )
}

export default HomeScreen
