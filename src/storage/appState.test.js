import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeAppState, defaultAppState } from './appState.js'

test('normalizeAppState aceita um estado legado em array', () => {
  const legacy = [
    { id: 'a', name: 'BCG', initialStock: 3, appliedToday: 2 },
    { id: 'b', name: 'Covid', frascos: 2, dosesPorFrasco: 5, appliedToday: 3 },
  ]

  const state = normalizeAppState(legacy)

  assert.deepEqual(state, {
    schemaVersion: 1,
    vaccines: [
      { id: 'a', name: 'BCG', initialStock: 3, appliedToday: 2, frascos: 3, dosesPorFrasco: 1 },
      { id: 'b', name: 'Covid', frascos: 2, dosesPorFrasco: 5, appliedToday: 3 },
    ],
    history: [],
  })
})

test('normalizeAppState normaliza dados vazios e ignora entradas inválidas', () => {
  const state = normalizeAppState({ vaccines: null, history: 'bad' })

  assert.deepEqual(state, defaultAppState)
})
