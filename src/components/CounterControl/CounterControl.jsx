import { MinusIcon, PlusIcon } from '../../icons'
import './CounterControl.css'

// Contador +/- de doses aplicadas hoje. onDecrement nao deixa passar de zero,
// isso e controlado por quem chama (App.jsx) para manter a regra num so lugar.
function CounterControl({ value, onDecrement, onIncrement, label = 'utilizadas hoje' }) {
  return (
    <div className="counter-control">
      <button type="button" className="counter-button counter-button-minus" onClick={onDecrement} aria-label="Remover uma dose">
        <MinusIcon size={22} />
      </button>

      <div className="counter-value">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

      <button type="button" className="counter-button counter-button-plus" onClick={onIncrement} aria-label="Adicionar uma dose">
        <PlusIcon size={22} />
      </button>
    </div>
  )
}

export default CounterControl
