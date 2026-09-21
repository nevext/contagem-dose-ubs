import { useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import VacinacaoScreen from './screens/VacinacaoScreen/VacinacaoScreen'
import ContagemDoDiaScreen from './screens/ContagemDoDiaScreen/ContagemDoDiaScreen'
import CadastroVacinasScreen from './screens/CadastroVacinasScreen/CadastroVacinasScreen'
import FinalizarDiaScreen from './screens/FinalizarDiaScreen/FinalizarDiaScreen'
import HistoricoScreen from './screens/HistoricoScreen/HistoricoScreen'
import VaccineInfoScreen from './screens/VaccineInfoScreen/VaccineInfoScreen'
import VaccineFormScreen from './screens/VaccineFormScreen/VaccineFormScreen'
import SettingsScreen from './screens/SettingsScreen/SettingsScreen'
import VacinacaoSettingsScreen from './screens/VacinacaoSettingsScreen/VacinacaoSettingsScreen'
import './App.css'

const STORAGE_KEY = 'contagem-dose-ubs'

const defaultState = {
  vaccines: [],
  history: [],
  selectionMode: 'deslizar',
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultState
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) return { ...defaultState, vaccines: parsed }
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function getToday() {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function App() {
  const [screen, setScreen] = useState('home')
  const [state, setState] = useState(loadState)
  const [activeIndex, setActiveIndex] = useState(0)
  const [infoVaccineId, setInfoVaccineId] = useState(null)
  const [editingVaccineId, setEditingVaccineId] = useState(null)

  const { vaccines, history, selectionMode } = state

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const safeActiveIndex = vaccines.length === 0 ? 0 : Math.min(activeIndex, vaccines.length - 1)

  const totalAppliedToday = vaccines.reduce((sum, vaccine) => sum + vaccine.appliedToday, 0)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())

  const addVaccine = ({ name, initialStock, dosePadrao, lote, validade }) => {
    setState((current) => ({
      ...current,
      vaccines: [
        ...current.vaccines,
        {
          id: crypto.randomUUID(),
          name,
          subtitle: name,
          dosePadrao,
          lote,
          validade,
          initialStock,
          appliedToday: 0,
          lastUsedAt: null,
        },
      ],
    }))
  }

  const updateVaccine = (id, { name, initialStock, dosePadrao, lote, validade }) => {
    setState((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine) =>
        vaccine.id === id ? { ...vaccine, name, subtitle: name, initialStock, dosePadrao, lote, validade } : vaccine,
      ),
    }))
  }

  const removeVaccine = (id) => {
    setState((current) => ({
      ...current,
      vaccines: current.vaccines.filter((vaccine) => vaccine.id !== id),
    }))
  }

  const changeDoses = (id, delta) => {
    setState((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine) => {
        if (vaccine.id !== id) return vaccine
        const nextValue = Math.min(vaccine.initialStock, Math.max(0, vaccine.appliedToday + delta))
        const lastUsedAt = delta > 0
          ? new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
          : vaccine.lastUsedAt
        return { ...vaccine, appliedToday: nextValue, lastUsedAt }
      }),
    }))
  }

  const finalizeDay = (entries) => {
    setState((current) => ({
      ...current,
      vaccines: [],
      history: [{ id: crypto.randomUUID(), date: getToday(), entries }, ...current.history],
    }))
    setActiveIndex(0)
    setScreen('vacinacao')
  }

  const setSelectionMode = (mode) => {
    setState((current) => ({ ...current, selectionMode: mode }))
  }

  const clearAllData = () => {
    setState(defaultState)
    setActiveIndex(0)
    setScreen('home')
  }

  const openInfo = (id) => {
    setInfoVaccineId(id)
    setScreen('info')
  }

  const openNewVaccineForm = () => {
    setEditingVaccineId(null)
    setScreen('vaccineForm')
  }

  const openEditVaccineForm = (id) => {
    setEditingVaccineId(id)
    setScreen('vaccineForm')
  }

  const saveVaccineForm = (payload) => {
    if (editingVaccineId) updateVaccine(editingVaccineId, payload)
    else addVaccine(payload)
    setScreen('cadastro')
  }

  const renderVacinacao = () => (
    <VacinacaoScreen
      totalAppliedToday={totalAppliedToday}
      formattedDate={formattedDate}
      onBack={() => setScreen('home')}
      onOpenContagem={() => setScreen('contagem')}
      onOpenCadastro={() => setScreen('cadastro')}
      onOpenFinalizar={() => setScreen('finalizar')}
      onOpenHistorico={() => setScreen('historico')}
      onOpenSettings={() => setScreen('vacinacaoSettings')}
    />
  )

  let activeScreen = (
    <HomeScreen onOpenVacinacao={() => setScreen('vacinacao')} onOpenSettings={() => setScreen('settings')} />
  )

  if (screen === 'vacinacao') {
    activeScreen = renderVacinacao()
  } else if (screen === 'contagem') {
    activeScreen = (
      <ContagemDoDiaScreen
        vaccines={vaccines}
        activeIndex={safeActiveIndex}
        onSelect={setActiveIndex}
        onIncrement={(id) => changeDoses(id, 1)}
        onDecrement={(id) => changeDoses(id, -1)}
        onBack={() => setScreen('vacinacao')}
        selectionMode={selectionMode}
        onOpenInfo={openInfo}
        onOpenCadastro={() => setScreen('cadastro')}
        onOpenHistorico={() => setScreen('historico')}
      />
    )
  } else if (screen === 'cadastro') {
    activeScreen = (
      <CadastroVacinasScreen
        vaccines={vaccines}
        onRemove={removeVaccine}
        onOpenNew={openNewVaccineForm}
        onOpenEdit={openEditVaccineForm}
        onBack={() => setScreen('vacinacao')}
      />
    )
  } else if (screen === 'vaccineForm') {
    const vaccine = editingVaccineId ? vaccines.find((item) => item.id === editingVaccineId) : null
    activeScreen = <VaccineFormScreen vaccine={vaccine} onSave={saveVaccineForm} onBack={() => setScreen('cadastro')} />
  } else if (screen === 'finalizar') {
    activeScreen = (
      <FinalizarDiaScreen vaccines={vaccines} onFinalize={finalizeDay} onBack={() => setScreen('vacinacao')} />
    )
  } else if (screen === 'historico') {
    activeScreen = <HistoricoScreen history={history} onBack={() => setScreen('vacinacao')} />
  } else if (screen === 'info') {
    const vaccine = vaccines.find((item) => item.id === infoVaccineId)
    activeScreen = vaccine ? <VaccineInfoScreen vaccine={vaccine} onBack={() => setScreen('contagem')} /> : renderVacinacao()
  } else if (screen === 'settings') {
    activeScreen = <SettingsScreen onClearData={clearAllData} onBack={() => setScreen('home')} />
  } else if (screen === 'vacinacaoSettings') {
    activeScreen = (
      <VacinacaoSettingsScreen
        selectionMode={selectionMode}
        onChangeSelectionMode={setSelectionMode}
        onBack={() => setScreen('vacinacao')}
      />
    )
  }

  return <div className="app-shell">{activeScreen}</div>
}

export default App
