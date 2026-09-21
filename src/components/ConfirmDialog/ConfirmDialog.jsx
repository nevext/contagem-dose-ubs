import './ConfirmDialog.css'

// Modal de confirmacao proprio do app, no lugar do window.confirm nativo
// do navegador (que mostra "localhost diz" e destoa do resto da interface).
function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="confirm-dialog-backdrop" onClick={onCancel}>
      <div className="confirm-dialog pop-in" onClick={(event) => event.stopPropagation()}>
        <strong>{title}</strong>
        {message && <p>{message}</p>}
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-cancel clay-tap" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-dialog-confirm clay-tap ${danger ? 'confirm-dialog-confirm-danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
