import test from 'node:test'
import assert from 'node:assert/strict'

import { SCREEN, getSafeActiveIndex, createVaccineRecord } from './useAppController.js'

test('SCREEN expõe rotas principais do app', () => {
  assert.equal(SCREEN.HOME, 'home')
  assert.equal(SCREEN.VACINACAO, 'vacinacao')
  assert.equal(SCREEN.SETTINGS, 'settings')
})

test('getSafeActiveIndex evita índices fora do intervalo', () => {
  assert.equal(getSafeActiveIndex(9, 3), 2)
  assert.equal(getSafeActiveIndex(-5, 3), 0)
  assert.equal(getSafeActiveIndex(1, 0), 0)
})

test('createVaccineRecord gera entrada válida para nova vacina', () => {
  const created = createVaccineRecord({
    name: 'BCG',
    frascos: 2,
    dosesPorFrasco: 5,
    dosePadrao: 1,
    fabricante: 'Lab',
    lote: 'L1',
    validade: '2035-01-10',
  })

  assert.equal(created.name, 'BCG')
  assert.equal(created.frascos, 2)
  assert.equal(created.dosesPorFrasco, 5)
  assert.equal(created.appliedToday, 0)
  assert.ok(created.id)
})
