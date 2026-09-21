import { useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen/HomeScreen'
import VacinacaoScreen from './screens/VacinacaoScreen/VacinacaoScreen'
import ContagemDoDiaScreen from './screens/ContagemDoDiaScreen/ContagemDoDiaScreen'
import CadastroVacinasScreen from './screens/CadastroVacinasScreen/CadastroVacinasScreen'
import FinalizarDiaScreen from './screens/FinalizarDiaScreen/FinalizarDiaScreen'
import HistoricoScreen from './screens/HistoricoScreen/HistoricoScreen'
import VaccineInfoScreen from './screens/VaccineInfoScreen/VaccineInfoScreen'
import VaccineFormScreen from './screens/VaccineFormScreen/VaccineFormScreen'
import VaccineSearchScreen from './screens/VaccineSearchScreen/VaccineSearchScreen'
import SettingsScreen from './screens/SettingsScreen/SettingsScreen'
import { exportBackupJson, exportHistoricoCsv } from './utils/exportData'
import './App.css'

const STORAGE_KEY = 'contagem-dose-ubs'

const defaultState = {
  vaccines: [],
  history: [],
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

  const { vaccines, history } = state

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const safeActiveIndex = vaccines.length === 0 ? 0 : Math.min(activeIndex, vaccines.length - 1)

  const totalAppliedToday = vaccines.reduce((sum, vaccine) => sum + vaccine.appliedToday, 0)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())

  const addVaccine = ({ name, initialStock, dosePadrao, fabricante, lote, validade }) => {
    setState((current) => ({
      ...current,
      vaccines: [
        ...current.vaccines,
        {
          id: crypto.randomUUID(),
          name,
          subtitle: name,
          dosePadrao,
          fabricante,
          lote,
          validade,
          initialStock,
          appliedToday: 0,
          lastUsedAt: null,
        },
      ],
    }))
  }

  const updateVaccine = (id, { name, initialStock, dosePadrao, fabricante, lote, validade }) => {
    setState((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine) =>
        vaccine.id === id ? { ...vaccine, name, subtitle: name, initialStock, dosePadrao, fabricante, lote, validade } : vaccine,
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
        const lastUsedAt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
        return { ...vaccine, appliedToday: nextValue, lastUsedAt }
      }),
    }))
  }

  const finalizeDay = (entries) => {
    const newRecord = { id: crypto.randomUUID(), date: getToday(), entries }
    const updatedHistory = [newRecord, ...history]
    setState((current) => ({
      ...current,
      vaccines: [],
      history: updatedHistory,
    }))
    exportHistoricoCsv(updatedHistory)
    setActiveIndex(0)
    setScreen('vacinacao')
  }

  const deleteHistoryRecord = (id) => {
    setState((current) => ({
      ...current,
      history: current.history.filter((record) => record.id !== id),
    }))
  }

  // Mescla um backup importado no estado atual: vacinas e registros do
  // historico com o mesmo id sao atualizados com o dado importado, o resto
  // e adicionado. Nada do que ja existe e apagado.
  const importBackup = ({ vaccines: importedVaccines, history: importedHistory }) => {
    setState((current) => {
      const vaccineMap = new Map(current.vaccines.map((vaccine) => [vaccine.id, vaccine]))
      importedVaccines.forEach((vaccine) => {
        if (!vaccine?.id) return
        vaccineMap.set(vaccine.id, { ...vaccineMap.get(vaccine.id), ...vaccine })
      })

      const historyMap = new Map(current.history.map((record) => [record.id, record]))
      importedHistory.forEach((record) => {
        if (!record?.id) return
        historyMap.set(record.id, { ...historyMap.get(record.id), ...record })
      })

      return {
        ...current,
        vaccines: Array.from(vaccineMap.values()),
        history: Array.from(historyMap.values()).sort((a, b) => b.date.localeCompare(a.date)),
      }
    })
  }

  const clearAllData = () => {
    setState(defaultState)
    setActiveIndex(0)
    setScreen('home')
  }

  const openInfo = (id) => {
    const index = vaccines.findIndex((vaccine) => vaccine.id === id)
    if (index >= 0) setActiveIndex(index)
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
      onOpenSearch={() => setScreen('search')}
    />
  )

  const total = vaccines.length
  const goPrevVaccine = () => {
    if (total === 0) return
    setActiveIndex((safeActiveIndex - 1 + total) % total)
  }
  const goNextVaccine = () => {
    if (total === 0) return
    setActiveIndex((safeActiveIndex + 1) % total)
  }

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
        onPrev={goPrevVaccine}
        onNext={goNextVaccine}
        onIncrement={(id) => changeDoses(id, 1)}
        onDecrement={(id) => changeDoses(id, -1)}
        onBack={() => setScreen('vacinacao')}
        onOpenInfo={openInfo}
        onOpenCadastro={() => setScreen('cadastro')}
        onOpenSearch={() => setScreen('search')}
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
    activeScreen = <HistoricoScreen history={history} onDeleteRecord={deleteHistoryRecord} onBack={() => setScreen('vacinacao')} />
  } else if (screen === 'search') {
    activeScreen = <VaccineSearchScreen vaccines={vaccines} onOpenInfo={openInfo} onBack={() => setScreen('vacinacao')} />
  } else if (screen === 'info') {
    const vaccine = vaccines.find((item) => item.id === infoVaccineId)
    activeScreen = vaccine ? <VaccineInfoScreen vaccine={vaccine} onBack={() => setScreen('contagem')} /> : renderVacinacao()
  } else if (screen === 'settings') {
    activeScreen = (
      <SettingsScreen
        onClearData={clearAllData}
        onExportBackup={() => exportBackupJson(state)}
        onImportBackup={importBackup}
        onBack={() => setScreen('home')}
      />
    )
  }

  return <div className="app-shell">{activeScreen}</div>
}

export default App
