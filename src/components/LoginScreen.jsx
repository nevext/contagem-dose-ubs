function LoginScreen({ onNavigate }) {
  return (
    <section className="login-screen" aria-labelledby="login-title">
      <div className="login-topbar" aria-hidden="true">
        <span>•••</span>
        <span>•••</span>
      </div>

      <div className="login-brand">
        <div className="brand-portrait" aria-hidden="true">
          <span className="portrait-hair" />
          <span className="portrait-face" />
          <span className="portrait-neck" />
        </div>
        <strong>UBS Care</strong>
      </div>

      <div className="login-water" aria-hidden="true">
        <span className="water-line water-line-one" />
        <span className="water-line water-line-two" />
      </div>

      <div className="login-content">
        <p className="login-kicker">Unidade de Saúde da Família</p>
        <h1 id="login-title">Bem-vindo</h1>
        <p className="login-subtitle">Escolha uma área para continuar</p>
        <div className="login-menu" aria-label="Menu principal">
          <button type="button" className="login-input menu-option available" onClick={() => onNavigate('vaccines')}>
            <span>Vacinas</span><small>Registrar e conferir doses</small>
          </button>
          <button type="button" className="login-input menu-option unavailable" onClick={() => onNavigate('maintenance')}>
            <span>Manutenção de Equipamentos</span><small>Em breve</small>
          </button>
          <button type="button" className="login-input menu-option unavailable" onClick={() => onNavigate('information')}>
            <span>Organização de Informações</span><small>Em breve</small>
          </button>
          <button type="button" className="login-input menu-option unavailable" onClick={() => onNavigate('schedule')}>
            <span>Agenda de Atendimento</span><small>Em breve</small>
          </button>
        </div>
        <p className="login-url">contagem-dose-ubs.local</p>
      </div>
    </section>
  )
}

export default LoginScreen