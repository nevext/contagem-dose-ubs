import { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '../../icons'
import { formatDateBR } from '../../utils/date'
import './ClayDatePicker.css'

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function parseIso(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  return new Date(`${value}T12:00:00`)
}

function toIso(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function buildMonthGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day))
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

// Calendario proprio pra substituir o <input type="date"> nativo do
// navegador (feio e sem nenhuma identidade visual). Abre num modal
// centralizado na tela, igual o ConfirmDialog, com navegacao por mes e um
// seletor rapido de ano.
function ClayDatePicker({ value, onChange, placeholder = 'Selecionar data' }) {
  const selected = useMemo(() => parseIso(value), [value])
  const [open, setOpen] = useState(false)
  const [pickingYear, setPickingYear] = useState(false)
  const [viewDate, setViewDate] = useState(() => selected ?? new Date())

  const openPicker = () => {
    setViewDate(selected ?? new Date())
    setPickingYear(false)
    setOpen(true)
  }

  const weeks = useMemo(() => buildMonthGrid(viewDate), [viewDate])
  const today = new Date()

  const changeMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  const yearOptions = useMemo(() => {
    const base = viewDate.getFullYear() - 2
    return Array.from({ length: 12 }, (_, index) => base + index)
  }, [viewDate])

  const pickDay = (day) => {
    onChange(toIso(day))
    setOpen(false)
  }

  const pickYear = (year) => {
    setViewDate((current) => new Date(year, current.getMonth(), 1))
    setPickingYear(false)
  }

  return (
    <div className="clay-date-picker">
      <button type="button" className="clay-date-trigger clay-tap" onClick={openPicker}>
        <CalendarIcon size={18} />
        <span className={value ? '' : 'clay-date-trigger-placeholder'}>{value ? formatDateBR(value) : placeholder}</span>
      </button>

      {open && (
        <div className="clay-date-backdrop" onClick={() => setOpen(false)}>
          <div className="clay-date-popover pop-in" onClick={(event) => event.stopPropagation()}>
            <div className="clay-date-header">
              <button type="button" className="clay-icon-button clay-tap" onClick={() => changeMonth(-1)} aria-label="Mês anterior" disabled={pickingYear}>
                <ChevronLeftIcon size={18} />
              </button>
              <button type="button" className="clay-date-title clay-tap" onClick={() => setPickingYear((current) => !current)}>
                {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </button>
              <button type="button" className="clay-icon-button clay-tap" onClick={() => changeMonth(1)} aria-label="Próximo mês" disabled={pickingYear}>
                <ChevronRightIcon size={18} />
              </button>
            </div>

            {pickingYear ? (
              <div className="clay-date-year-grid">
                {yearOptions.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={`clay-date-year clay-tap ${year === viewDate.getFullYear() ? 'clay-date-year-active' : ''}`}
                    onClick={() => pickYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="clay-date-weekdays">
                  {WEEKDAY_LABELS.map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                  ))}
                </div>
                <div className="clay-date-grid">
                  {weeks.map((week, weekIndex) => (
                    <div className="clay-date-week" key={`week-${weekIndex}`}>
                      {week.map((day, dayIndex) => {
                        if (!day) return <span key={`empty-${weekIndex}-${dayIndex}`} className="clay-date-cell clay-date-cell-empty" />
                        const isSelected = selected && isSameDay(day, selected)
                        const isToday = isSameDay(day, today)
                        return (
                          <button
                            type="button"
                            key={toIso(day)}
                            className={`clay-date-cell clay-date-day clay-tap ${isSelected ? 'clay-date-day-selected' : ''} ${isToday ? 'clay-date-day-today' : ''}`}
                            onClick={() => pickDay(day)}
                          >
                            {day.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}

            <button type="button" className="clay-date-close clay-tap" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClayDatePicker
