import { useEffect, useState } from 'react'

import { defaultAppState, loadAppState, saveAppState } from '../utils/appState.js'
import { exportHistoricoCsv } from '../utils/exportData.js'
import { normalizeVaccine, totalDoses } from '../utils/vaccine.js'

export const SCREEN = {
  HOME: 'home',
  VACINACAO: 'vacinacao',
  CONTAGEM: 'contagem',
  CADASTRO: 'cadastro',
  FINALIZAR: 'finalizar',
  HISTORICO: 'historico',
  SEARCH: 'search',
  INFO: 'info',
  SETTINGS: 'settings',
  VACCINE_FORM: 'vaccineForm',
}

export function getSafeActiveIndex(index, totalItems) {
  if (totalItems <= 0) return 0
  return Math.min(Math.max(index, 0), totalItems - 1)
}

export function createVaccineRecord({
  name,
  frascos,
  dosesPorFrasco,
  dosePadrao,
  fabricante,
  lote,
  validade,
}) {
  return {
    id: crypto.randomUUID(),
    name,
    subtitle: name,
    dosePadrao,
    fabricante,
    lote,
    validade,
    frascos,
    dosesPorFrasco,
    appliedToday: 0,
    lastUsedAt: null,
  }
}

function getToday() {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export function useAppController() {
  const [screen, setScreen] = useState(SCREEN.HOME)
  const [state, setState] = useState(loadAppState)
  const [activeIndex, setActiveIndex] = useState(0)
  const [infoVaccineId, setInfoVaccineId] = useState(null)
  const [editingVaccineId, setEditingVaccineId] = useState(null)

  useEffect(() => {
    saveAppState(state)
  }, [state])

  const vaccines = state.vaccines
  const history = state.history
  const safeActiveIndex = getSafeActiveIndex(activeIndex, vaccines.length)
  const totalAppliedToday = vaccines.reduce((sum, vaccine) => sum + vaccine.appliedToday, 0)
  const formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())

  const addVaccine = ({ name, frascos, dosesPorFrasco, dosePadrao, fabricante, lote, validade }) => {
    setState((current) => ({
      ...current,
      vaccines: [...current.vaccines, createVaccineRecord({ name, frascos, dosesPorFrasco, dosePadrao, fabricante, lote, validade })],
    }))
  }

  const updateVaccine = (id, { name, frascos, dosesPorFrasco, dosePadrao, fabricante, lote, validade }) => {
    setState((current) => ({
      ...current,
      vaccines: current.vaccines.map((vaccine) =>
        vaccine.id === id
          ? { ...vaccine, name, subtitle: name, frascos, dosesPorFrasco, dosePadrao, fabricante, lote, validade }
          : vaccine,
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
        const nextValue = Math.min(totalDoses(vaccine), Math.max(0, vaccine.appliedToday + delta))
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
    setScreen(SCREEN.VACINACAO)
  }

  const deleteHistoryRecord = (id) => {
    setState((current) => ({
      ...current,
      history: current.history.filter((record) => record.id !== id),
    }))
  }

  const importBackup = ({ vaccines: importedVaccines, history: importedHistory }) => {
    setState((current) => {
      const vaccineMap = new Map(current.vaccines.map((vaccine) => [vaccine.id, vaccine]))
      importedVaccines.forEach((vaccine) => {
        if (!vaccine?.id) return
        vaccineMap.set(vaccine.id, normalizeVaccine({ ...vaccineMap.get(vaccine.id), ...vaccine }))
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
    setState(defaultAppState)
    setActiveIndex(0)
    setScreen(SCREEN.HOME)
  }

  const openInfo = (id) => {
    const index = vaccines.findIndex((vaccine) => vaccine.id === id)
    if (index >= 0) setActiveIndex(index)
    setInfoVaccineId(id)
    setScreen(SCREEN.INFO)
  }

  const openNewVaccineForm = () => {
    setEditingVaccineId(null)
    setScreen(SCREEN.VACCINE_FORM)
  }

  const openEditVaccineForm = (id) => {
    setEditingVaccineId(id)
    setScreen(SCREEN.VACCINE_FORM)
  }

  const saveVaccineForm = (payload) => {
    if (editingVaccineId) updateVaccine(editingVaccineId, payload)
    else addVaccine(payload)
    setScreen(SCREEN.CADASTRO)
  }

  const goPrevVaccine = () => {
    if (vaccines.length === 0) return
    setActiveIndex((safeActiveIndex - 1 + vaccines.length) % vaccines.length)
  }

  const goNextVaccine = () => {
    if (vaccines.length === 0) return
    setActiveIndex((safeActiveIndex + 1) % vaccines.length)
  }

  return {
    screen,
    setScreen,
    setActiveIndex,
    state,
    activeIndex: safeActiveIndex,
    infoVaccineId,
    editingVaccineId,
    vaccines,
    history,
    totalAppliedToday,
    formattedDate,
    addVaccine,
    updateVaccine,
    removeVaccine,
    changeDoses,
    finalizeDay,
    deleteHistoryRecord,
    importBackup,
    clearAllData,
    openInfo,
    openNewVaccineForm,
    openEditVaccineForm,
    saveVaccineForm,
    goPrevVaccine,
    goNextVaccine,
    setInfoVaccineId,
    setEditingVaccineId,
  }
}
