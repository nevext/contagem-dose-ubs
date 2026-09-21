import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { HealthMarkIcon, TrashIcon, DownloadIcon } from '../../icons'
import { APP_VERSION } from '../../utils/version'
import './SettingsScreen.css'

// Definicoes gerais do app (nao especificas de uma secao). As preferencias
// da roda de vacinas moraram pro menu "..." dentro de Vacinacao; aqui fica o
// que e sobre o app como um todo. Espaco livre pra crescer conforme as
// outras secoes (Manutencao, Organizacao, Agenda) forem ganhando telas.
function SettingsScreen({ onClearData, onExportBackup, onBack }) {
  const [confirmingClear, setConfirmingClear] = useState(false)

  const handleClear = () => {
    onClearData()
    setConfirmingClear(false)
  }

  return (
    <div className="settings-screen screen-enter">
      <ScreenHeader title="Definições" onBack={onBack} />

      <div className="settings-body">
        <p className="settings-section-title">Sobre o app</p>
        <div className="settings-about-card">
          <span className="settings-about-icon">
            <HealthMarkIcon size={22} />
          </span>
          <div className="settings-about-texts">
            <strong>Contagem de Doses · USF</strong>
            <span>v{APP_VERSION} · Protótipo de extensão universitária, CIESA</span>
            <span>Projeto: David Neves de Figueiredo, Samia Albuquerque, Yara Vaz da Silva e Jhemerson Conde, em parceria com a USF.</span>
          </div>
        </div>

        <p className="settings-section-title">Backup</p>
        <button type="button" className="settings-option clay-tap" onClick={onExportBackup}>
          <span className="settings-option-icon">
            <DownloadIcon size={18} />
          </span>
          <div className="settings-option-texts">
            <strong>Exportar backup</strong>
            <span>Baixa um arquivo com as vacinas de hoje e todo o histórico, pra guardar fora do aparelho.</span>
          </div>
        </button>

        <p className="settings-section-title">Dados locais</p>
        <button type="button" className="settings-danger-option clay-tap" onClick={() => setConfirmingClear(true)}>
          <span className="settings-danger-icon">
            <TrashIcon size={18} />
          </span>
          <div className="settings-option-texts">
            <strong>Limpar todos os dados</strong>
            <span>Apaga vacinas cadastradas, contagem do dia e histórico deste aparelho.</span>
          </div>
        </button>
      </div>

      <ConfirmDialog
        open={confirmingClear}
        title="Limpar todos os dados"
        message="Isso apaga as vacinas cadastradas, a contagem do dia e todo o histórico salvo neste aparelho. Não dá pra desfazer."
        confirmLabel="Limpar tudo"
        danger
        onConfirm={handleClear}
        onCancel={() => setConfirmingClear(false)}
      />
    </div>
  )
}

export default SettingsScreen
