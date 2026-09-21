import { useEffect, useState } from 'react'
import CadastroVacina from './components/CadastroVacina'
import CartaoVacina from './components/CartaoVacina'
import FechamentoDia from './components/FechamentoDia'
import './App.css'

const STORAGE_KEY = 'contagem-dose-ubs'

const getToday = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

const initialState = {
  vaccines: [],
  history: [],
  isClosing: false,
}

function App() {
  const [appState, setAppState] = useState(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      return savedState ? { ...initialState, ...JSON.parse(savedState) } : initialState
    } catch {
      return initialState
    }
  })

  // Mantem o expediente atual e o historico mesmo apos recarregar a pagina.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
  }, [appState])

  const addVaccine = ({ name, initialStock }) => {
    const normalizedName = name.trim()
    if (!normalizedName || initialStock < 0) return

    setAppState((current) => ({
      ...current,
      vaccines: [
        ...current.vaccines,
        {
          id: crypto.randomUUID(),
          name: normalizedName,
          initialStock,
          appliedDoses: 0,
        },
      ],
    }))
  }

  const changeDoses = (id, amount) => {
    setAppState((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine) => {
        if (vaccine.id !== id) return vaccine
        return {
          ...vaccine,
          appliedDoses: Math.max(0, vaccine.appliedDoses + amount),
        }
      }),
    }))
  }

  const openClosing = () => setAppState((current) => ({ ...current, isClosing: true }))

  const cancelClosing = () => setAppState((current) => ({ ...current, isClosing: false }))

  // Fecha o expediente, salva a conferencia e prepara um novo dia vazio.
  const finishDay = (physicalStock) => {
    const record = {
      id: crypto.randomUUID(),
      date: getToday(),
      vaccines: appState.vaccines.map((vaccine) => ({
        ...vaccine,
        physicalStock: physicalStock[vaccine.id],
      })),
    }

    setAppState((current) => ({
      ...current,
      history: [record, ...current.history],
      vaccines: [],
      isClosing: false,
    }))
  }

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
  }).format(new Date())

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">+</div>
        <div>
          <p className="eyebrow">Unidade de Saúde da Família</p>
          <h1>Contagem de doses</h1>
        </div>
        <time dateTime={getToday()}>{formattedDate}</time>
      </header>

      <section className="intro-section" aria-labelledby="page-title">
        <div>
          <p className="section-kicker">Controle diário</p>
          <h2 id="page-title">Doses aplicadas hoje</h2>
          <p className="muted-text">Registre cada aplicação para conferir o estoque no fim do expediente.</p>
        </div>
        <span className="vaccine-total">{appState.vaccines.length} {appState.vaccines.length === 1 ? 'vacina' : 'vacinas'}</span>
      </section>

      <CadastroVacina onAdd={addVaccine} />

      {appState.vaccines.length > 0 ? (
        <section className="vaccine-list" aria-label="Vacinas cadastradas">
          {appState.vaccines.map((vaccine) => (
            <CartaoVacina key={vaccine.id} vaccine={vaccine} onChangeDoses={changeDoses} />
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <span className="empty-icon" aria-hidden="true">+</span>
          <h2>Nenhuma vacina cadastrada</h2>
          <p>Comece adicionando uma vacina e informe o estoque inicial.</p>
        </section>
      )}

      <section className="closing-action">
        <button type="button" className="primary-button" onClick={openClosing} disabled={!appState.vaccines.length}>
          Fechar o dia <span aria-hidden="true">→</span>
        </button>
        <p>Confira o estoque físico e veja se os números conferem.</p>
      </section>

      {appState.history.length > 0 && (
        <section className="history-section" aria-labelledby="history-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Acompanhamento</p>
              <h2 id="history-title">Histórico recente</h2>
            </div>
            <span className="history-count">{appState.history.length} fechamento{appState.history.length === 1 ? '' : 's'}</span>
          </div>
          <div className="history-list">
            {appState.history.slice(0, 7).map((record) => {
              const divergent = record.vaccines.filter((vaccine) => vaccine.initialStock - vaccine.appliedDoses - vaccine.physicalStock !== 0).length
              return (
                <article className="history-row" key={record.id}>
                  <div>
                    <strong>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${record.date}T12:00:00`))}</strong>
                    <span>{record.vaccines.length} {record.vaccines.length === 1 ? 'vacina conferida' : 'vacinas conferidas'}</span>
                  </div>
                  <span className={`history-status ${divergent ? 'has-divergence' : 'is-ok'}`}>
                    {divergent ? `${divergent} divergência${divergent === 1 ? '' : 's'}` : 'Sem divergência'}
                  </span>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {appState.isClosing && (
        <FechamentoDia vaccines={appState.vaccines} onCancel={cancelClosing} onFinish={finishDay} />
      )}
    </main>
  )
}

export default App
