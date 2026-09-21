import { useEffect, useState } from 'react'
import CadastroVacina from './components/CadastroVacina'
import CartaoVacina from './components/CartaoVacina'
import FechamentoDia from './components/FechamentoDia'
import LoginScreen from './components/LoginScreen'
import './App.css'

const STORAGE_KEY = 'contagem-dose-ubs'

const getToday = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

const initialState = { vaccines: [], history: [] }

function App() {
  const [appState, setAppState] = useState(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      return savedState ? { ...initialState, ...JSON.parse(savedState) } : initialState
    } catch {
      return initialState
    }
  })
  const [screen, setScreen] = useState('home')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
  }, [appState])

  const addVaccine = ({ name, initialStock }) => {
    const normalizedName = name.trim()
    if (!normalizedName || initialStock < 0) return
    setAppState((current) => ({
      ...current,
      vaccines: [...current.vaccines, { id: crypto.randomUUID(), name: normalizedName, initialStock, appliedDoses: 0 }],
    }))
  }

  const changeDoses = (id, amount) => {
    setAppState((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine) => vaccine.id === id
        ? { ...vaccine, appliedDoses: Math.max(0, vaccine.appliedDoses + amount) }
        : vaccine),
    }))
  }

  const finishDay = (physicalStock) => {
    const record = {
      id: crypto.randomUUID(),
      date: getToday(),
      vaccines: appState.vaccines.map((vaccine) => ({ ...vaccine, physicalStock: physicalStock[vaccine.id] })),
    }
    setAppState((current) => ({ ...current, history: [record, ...current.history], vaccines: [] }))
    setScreen('vaccines')
  }

  const navigate = (nextScreen) => setScreen(nextScreen)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())

  const renderHeader = (backScreen) => (
    <header className="app-header">
      {backScreen ? <button type="button" className="back-button" onClick={() => navigate(backScreen)} aria-label="Voltar">Voltar</button> : <div className="brand-mark" aria-hidden="true">+</div>}
      <div><p className="eyebrow">Unidade de Saúde da Família</p><h1>Contagem de doses</h1></div>
      <time dateTime={getToday()}>{formattedDate}</time>
    </header>
  )

  const renderHistory = () => appState.history.length > 0 && (
    <section className="history-section" aria-labelledby="history-title">
      <div className="section-heading"><div><p className="section-kicker">Acompanhamento</p><h2 id="history-title">Histórico recente</h2></div><span className="history-count">{appState.history.length} fechamento{appState.history.length === 1 ? '' : 's'}</span></div>
      <div className="history-list">
        {appState.history.slice(0, 7).map((record) => {
          const divergent = record.vaccines.filter((vaccine) => vaccine.initialStock - vaccine.appliedDoses - vaccine.physicalStock !== 0).length
          return <article className="history-row" key={record.id}><div><strong>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${record.date}T12:00:00`))}</strong><span>{record.vaccines.length} {record.vaccines.length === 1 ? 'vacina conferida' : 'vacinas conferidas'}</span></div><span className={`history-status ${divergent ? 'has-divergence' : 'is-ok'}`}>{divergent ? `${divergent} divergência${divergent === 1 ? '' : 's'}` : 'Sem divergência'}</span></article>
        })}
      </div>
    </section>
  )

  const renderVaccineMenu = () => (
    <main className="app-shell inner-shell">
      {renderHeader('home')}
      <section className="welcome-section compact"><p className="section-kicker">Área selecionada</p><h2>Vacinas</h2><p className="muted-text">Acesse cada etapa do controle diário.</p></section>
      <nav className="purpose-menu" aria-label="Menu de vacinas">
        <button type="button" className="purpose-card" onClick={() => navigate('register')}><span className="purpose-number">01</span><span><strong>Cadastrar vacinas do dia</strong><small>Informe o nome e o estoque inicial</small></span></button>
        <button type="button" className="purpose-card" onClick={() => navigate('count')}><span className="purpose-number">02</span><span><strong>Contagem do dia</strong><small>Registre cada dose aplicada</small></span></button>
        <button type="button" className="purpose-card" onClick={() => navigate('finish')} disabled={!appState.vaccines.length}><span className="purpose-number">03</span><span><strong>Finalizar o dia</strong><small>Compare o estoque físico</small></span></button>
      </nav>
      {renderHistory()}
    </main>
  )

  const renderRegister = () => (
    <main className="app-shell inner-shell">
      {renderHeader('vaccines')}
      <section className="screen-heading"><p className="section-kicker">Etapa 01 · Manhã</p><h2>Cadastrar vacinas do dia</h2><p className="muted-text">Organize o estoque antes do início dos atendimentos.</p></section>
      <CadastroVacina onAdd={addVaccine} />
      {appState.vaccines.length > 0 && <div className="registered-summary"><strong>{appState.vaccines.length} vacinas cadastradas</strong><button type="button" onClick={() => navigate('count')}>Ir para contagem</button></div>}
    </main>
  )

  const renderCount = () => (
    <main className="app-shell inner-shell">
      {renderHeader('vaccines')}
      <section className="screen-heading with-count"><div><p className="section-kicker">Etapa 02 · Durante o dia</p><h2>Contagem do dia</h2><p className="muted-text">Toque uma vez a cada dose aplicada.</p></div><span className="vaccine-total">{appState.vaccines.length} {appState.vaccines.length === 1 ? 'vacina' : 'vacinas'}</span></section>
      {appState.vaccines.length > 0 ? <section className="vaccine-list" aria-label="Vacinas cadastradas">{appState.vaccines.map((vaccine) => <CartaoVacina key={vaccine.id} vaccine={vaccine} onChangeDoses={changeDoses} />)}</section> : <section className="empty-state"><span className="empty-icon" aria-hidden="true">+</span><h2>Nenhuma vacina cadastrada</h2><p>Volte ao cadastro para começar o controle do dia.</p><button type="button" className="secondary-button empty-action" onClick={() => navigate('register')}>Cadastrar vacinas</button></section>}
    </main>
  )

  const renderFinish = () => (
    <main className="app-shell inner-shell">
      {renderHeader('vaccines')}
      <section className="screen-heading"><p className="section-kicker">Etapa 03 · Encerramento</p><h2>Finalizar o dia</h2><p className="muted-text">Conte o estoque físico para comparar com o esperado.</p></section>
      {appState.vaccines.length > 0 ? <FechamentoDia vaccines={appState.vaccines} onCancel={() => navigate('vaccines')} onFinish={finishDay} /> : <section className="empty-state"><h2>Não há um dia em andamento</h2><p>Cadastre as vacinas antes de finalizar o dia.</p></section>}
    </main>
  )

    const renderUnavailable = () => (
      <main className="app-shell inner-shell">
        {renderHeader('home')}
        <section className="unavailable-screen">
          <span className="unavailable-icon" aria-hidden="true">•••</span>
          <p className="section-kicker">Em breve</p>
          <h2>Funcionalidade em análise</h2>
          <p className="muted-text">Esta área está sendo preparada e estará disponível em uma próxima versão.</p>
          <button type="button" className="primary-button" onClick={() => navigate('home')}>Voltar ao menu</button>
        </section>
      </main>
    )

  if (screen === 'home') return <main className="app-shell login-shell"><LoginScreen onNavigate={navigate} /></main>
  if (screen === 'vaccines') return renderVaccineMenu()
  if (screen === 'register') return renderRegister()
  if (screen === 'count') return renderCount()
  if (screen === 'finish') return renderFinish()
  return renderUnavailable()
}

export default App
