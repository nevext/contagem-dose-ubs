import { useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import VacinacaoScreen from './screens/VacinacaoScreen/VacinacaoScreen'
import ContagemDoDiaScreen from './screens/ContagemDoDiaScreen/ContagemDoDiaScreen'
import PlaceholderScreen from './screens/PlaceholderScreen/PlaceholderScreen'
import './App.css'

const STORAGE_KEY = 'contagem-dose-ubs'

// Vacinas de exemplo para a tela de Contagem do Dia funcionar de ponta a
// ponta enquanto o Cadastro de Vacinas ainda nao tem tela propria.
const seedVaccines = [
  {
    id: 'febre-amarela',
    name: 'Febre Amarela',
    subtitle: 'Febre Amarela',
    dosePadrao: '1 dose',
    lote: 'FA0821',
    validade: '15/03/2027',
    initialStock: 30,
    appliedToday: 3,
    lastUsedAt: '14:10',
  },
  {
    id: 'gripe',
    name: 'Gripe',
    subtitle: 'Influenza',
    dosePadrao: '1 dose',
    lote: 'AB1234',
    validade: '30/06/2026',
    initialStock: 60,
    appliedToday: 18,
    lastUsedAt: '16:42',
  },
  {
    id: 'covid-19',
    name: 'COVID-19',
    subtitle: 'Covid-19',
    dosePadrao: '2 doses',
    lote: 'CV5567',
    validade: '20/12/2026',
    initialStock: 40,
    appliedToday: 2,
    lastUsedAt: '15:05',
  },
  {
    id: 'hepatite-b',
    name: 'Hepatite B',
    subtitle: 'Hepatite B',
    dosePadrao: '3 doses',
    lote: 'HB9012',
    validade: '10/09/2027',
    initialStock: 25,
    appliedToday: 1,
    lastUsedAt: '11:30',
  },
]

function loadVaccines() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedVaccines
  } catch {
    return seedVaccines
  }
}

function App() {
  const [screen, setScreen] = useState('home')
  const [placeholderTitle, setPlaceholderTitle] = useState('')
  const [vaccines, setVaccines] = useState(loadVaccines)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vaccines))
  }, [vaccines])

  const totalAppliedToday = vaccines.reduce((sum, vaccine) => sum + vaccine.appliedToday, 0)

  const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())

  const changeDoses = (id, delta) => {
    setVaccines((current) =>
      current.map((vaccine) => {
        if (vaccine.id !== id) return vaccine
        const nextValue = Math.min(vaccine.initialStock, Math.max(0, vaccine.appliedToday + delta))
        const lastUsedAt = delta > 0
          ? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
          : vaccine.lastUsedAt
        return { ...vaccine, appliedToday: nextValue, lastUsedAt }
      }),
    )
  }

  const total = vaccines.length
  const goPrevVaccine = () => setActiveIndex((current) => (current - 1 + total) % total)
  const goNextVaccine = () => setActiveIndex((current) => (current + 1) % total)

  const openPlaceholder = (title) => {
    setPlaceholderTitle(title)
    setScreen('placeholder')
  }

  let activeScreen = <HomeScreen onOpenVacinacao={() => setScreen('vacinacao')} />

  if (screen === 'vacinacao') {
    activeScreen = (
      <VacinacaoScreen
        totalAppliedToday={totalAppliedToday}
        formattedDate={formattedDate}
        onBack={() => setScreen('home')}
        onOpenContagem={() => setScreen('contagem')}
        onOpenPlaceholder={openPlaceholder}
      />
    )
  } else if (screen === 'contagem') {
    activeScreen = (
      <ContagemDoDiaScreen
        vaccines={vaccines}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onPrev={goPrevVaccine}
        onNext={goNextVaccine}
        onIncrement={(id) => changeDoses(id, 1)}
        onDecrement={(id) => changeDoses(id, -1)}
        onBack={() => setScreen('vacinacao')}
      />
    )
  } else if (screen === 'placeholder') {
    activeScreen = <PlaceholderScreen title={placeholderTitle} onBack={() => setScreen('vacinacao')} />
  }

  return <div className="app-shell">{activeScreen}</div>
}

export default App
