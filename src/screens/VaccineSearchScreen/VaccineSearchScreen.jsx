import { useMemo, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import { SearchIcon, SyringeIcon, CloseIcon } from '../../icons'
import { formatDateBR } from '../../utils/date'
import './VaccineSearchScreen.css'

const MODES = [
  { key: 'nome', label: 'Nome', field: 'name', placeholder: 'Buscar por nome' },
  { key: 'lote', label: 'Lote', field: 'lote', placeholder: 'Buscar por lote' },
  { key: 'fabricante', label: 'Fabricante', field: 'fabricante', placeholder: 'Buscar por fabricante' },
  { key: 'validade', label: 'Validade', field: 'validade', placeholder: 'Buscar por data (ex: 05/2026)' },
]

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

// Busca vacinas cadastradas por nome, lote, fabricante ou validade. No modo
// validade a pessoa tambem pode marcar direto o(s) ano(s) de vencimento que
// quer ver, sem precisar digitar nada.
function VaccineSearchScreen({ vaccines, onOpenInfo, onBack }) {
  const [mode, setMode] = useState('nome')
  const [query, setQuery] = useState('')
  const [selectedYears, setSelectedYears] = useState([])

  const activeMode = MODES.find((item) => item.key === mode)

  const availableYears = useMemo(() => {
    const years = vaccines
      .map((vaccine) => vaccine.validade)
      .filter((validade) => /^\d{4}-\d{2}-\d{2}$/.test(validade ?? ''))
      .map((validade) => validade.slice(0, 4))
    return Array.from(new Set(years)).sort()
  }, [vaccines])

  const toggleYear = (year) => {
    setSelectedYears((current) =>
      current.includes(year) ? current.filter((item) => item !== year) : [...current, year],
    )
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setQuery('')
    setSelectedYears([])
  }

  const results = useMemo(() => {
    if (mode === 'validade' && selectedYears.length > 0) {
      return vaccines
        .filter((vaccine) => selectedYears.includes((vaccine.validade ?? '').slice(0, 4)))
        .slice()
        .sort((a, b) => (a.validade ?? '').localeCompare(b.validade ?? ''))
    }

    const trimmed = query.trim()

    if (mode === 'validade') {
      if (!trimmed) {
        return vaccines
          .filter((vaccine) => vaccine.validade)
          .slice()
          .sort((a, b) => a.validade.localeCompare(b.validade))
      }
      const needle = normalize(trimmed)
      return vaccines.filter(
        (vaccine) => normalize(formatDateBR(vaccine.validade)).includes(needle) || normalize(vaccine.validade).includes(needle),
      )
    }

    if (!trimmed) return vaccines
    const needle = normalize(trimmed)
    return vaccines.filter((vaccine) => normalize(vaccine[activeMode.field]).includes(needle))
  }, [vaccines, mode, query, selectedYears, activeMode])

  return (
    <div className="vaccine-search-screen screen-enter">
      <ScreenHeader title="Buscar vacina" subtitle="Vacinação" onBack={onBack} />

      <div className="vaccine-search-body">
        <div className="vaccine-search-modes">
          {MODES.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`vaccine-search-mode clay-tap ${mode === item.key ? 'vaccine-search-mode-active' : ''}`}
              onClick={() => changeMode(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mode === 'validade' && availableYears.length > 0 && (
          <div className="vaccine-search-years">
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                className={`vaccine-search-year clay-tap ${selectedYears.includes(year) ? 'vaccine-search-year-active' : ''}`}
                onClick={() => toggleYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        <label className="vaccine-search-field">
          <SearchIcon size={18} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={selectedYears.length > 0 ? 'Ou digite pra refinar' : activeMode.placeholder}
          />
          {query && (
            <button type="button" className="vaccine-search-clear" onClick={() => setQuery('')} aria-label="Limpar busca">
              <CloseIcon size={16} />
            </button>
          )}
        </label>

        {results.length === 0 ? (
          <div className="vaccine-search-empty">
            <span className="vaccine-search-empty-icon">
              <SearchIcon size={26} />
            </span>
            <strong>Nenhuma vacina encontrada</strong>
            <p>Tenta buscar por outro termo ou trocar o tipo de busca.</p>
          </div>
        ) : (
          <ul className="vaccine-search-list">
            {results.map((vaccine) => (
              <li key={vaccine.id}>
                <button type="button" className="vaccine-search-item clay-tap" onClick={() => onOpenInfo(vaccine.id)}>
                  <span className="vaccine-search-item-icon">
                    <SyringeIcon size={20} />
                  </span>
                  <div className="vaccine-search-item-texts">
                    <strong>{vaccine.name}</strong>
                    {mode === 'lote' && <span>Lote: {vaccine.lote ?? '—'}</span>}
                    {mode === 'fabricante' && <span>Fabricante: {vaccine.fabricante ?? '—'}</span>}
                    {mode === 'validade' && <span>Validade: {formatDateBR(vaccine.validade)}</span>}
                    {mode === 'nome' && <span>{vaccine.fabricante && vaccine.fabricante !== '—' ? vaccine.fabricante : 'Lote ' + (vaccine.lote ?? '—')}</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default VaccineSearchScreen
