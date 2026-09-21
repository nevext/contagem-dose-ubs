import './UsfMark.css'

// Marca real da unidade: a USF nao tem logo proprio, so a sigla "USF" em
// branco sobre o teal da fachada (#1B7A8C), igual a placa na entrada.
function UsfMark({ size = 'sm' }) {
  return <span className={`usf-mark usf-mark-${size}`}>USF</span>
}

export default UsfMark
