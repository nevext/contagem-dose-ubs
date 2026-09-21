import { MinusIcon, PlusIcon } from '../../icons'
import './CounterControl.css'

// Contador +/- de doses aplicadas hoje. onDecrement nao deixa passar de zero,
// isso e controlado por quem chama (App.jsx) para manter a regra num so lugar.
// Quando a vacina vem em frasco multi-dose, frascoProgress mostra quantas
// doses ja saíram do frasco que esta aberto agora.
function CounterControl({ value, onDecrement, onIncrement, label = 'utilizadas hoje', frascoProgress }) {
  return (
    <div className="counter-control">
      <div className="counter-control-main">
        <button type="button" className="counter-button counter-button-minus clay-tap" onClick={onDecrement} aria-label="Remover uma dose">
          <MinusIcon size={22} />
        </button>

        <div className="counter-value">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>

        <button type="button" className="counter-button counter-button-plus clay-tap" onClick={onIncrement} aria-label="Adicionar uma dose">
          <PlusIcon size={22} />
        </button>
      </div>

      {frascoProgress && frascoProgress.total > 1 && (
        <div className="counter-frasco-progress">
          {frascoProgress.total <= 20 ? (
            <div className="counter-frasco-dots">
              {Array.from({ length: frascoProgress.total }, (_, index) => (
                <span key={index} className={`counter-frasco-dot ${index < frascoProgress.used ? 'counter-frasco-dot-filled' : ''}`} />
              ))}
            </div>
          ) : (
            <div className="counter-frasco-bar">
              <div className="counter-frasco-bar-fill" style={{ width: `${(frascoProgress.used / frascoProgress.total) * 100}%` }} />
            </div>
          )}
          <span>
            Frasco em uso: {frascoProgress.used}/{frascoProgress.total} doses
          </span>
        </div>
      )}
    </div>
  )
}

export default CounterControl
