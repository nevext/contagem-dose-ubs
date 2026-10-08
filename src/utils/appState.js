import { normalizeVaccine } from './vaccine.js'

export const STORAGE_KEY = 'contagem-dose-ubs'
export const APP_STATE_VERSION = 1

export const defaultAppState = {
  schemaVersion: APP_STATE_VERSION,
  vaccines: [],
  history: [],
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function normalizeAppState(rawState) {
  if (Array.isArray(rawState)) {
    return {
      ...defaultAppState,
      vaccines: rawState.filter(Boolean).map((vaccine) => normalizeVaccine(vaccine)),
    }
  }

  if (!isPlainObject(rawState)) {
    return { ...defaultAppState }
  }

  const vaccines = Array.isArray(rawState.vaccines)
    ? rawState.vaccines.filter(Boolean).map((vaccine) => normalizeVaccine(vaccine))
    : []

  const history = Array.isArray(rawState.history) ? rawState.history.filter(Boolean) : []

  return {
    ...defaultAppState,
    vaccines,
    history,
  }
}

export function loadAppState(storage = globalThis.localStorage) {
  try {
    const saved = storage?.getItem?.(STORAGE_KEY)
    if (!saved) return { ...defaultAppState }

    const parsed = JSON.parse(saved)
    return normalizeAppState(parsed)
  } catch {
    return { ...defaultAppState }
  }
}

export function saveAppState(state, storage = globalThis.localStorage) {
  const normalized = normalizeAppState(state)
  storage?.setItem?.(STORAGE_KEY, JSON.stringify(normalized))
  return normalized
}
