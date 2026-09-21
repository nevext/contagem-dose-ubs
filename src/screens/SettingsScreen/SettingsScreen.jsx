import { useRef, useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader/ScreenHeader'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { HealthMarkIcon, TrashIcon, DownloadIcon, UploadIcon, AlertIcon } from '../../icons'
import { APP_VERSION } from '../../utils/version'
import { parseBackupJson } from '../../utils/exportData'
import './SettingsScreen.css'

// Definicoes gerais do app (nao especificas de uma secao). As preferencias
// da roda de vacinas moraram pro menu "..." dentro de Vacinacao; aqui fica o
// que e sobre o app como um todo. Espaco livre pra crescer conforme as
// outras secoes (Manutencao, Organizacao, Agenda) forem ganhando telas.
function SettingsScreen({ onClearData, onExportBackup, onImportBackup, onBack }) {
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [pendingImport, setPendingImport] = useState(null)
  const [importError, setImportError] = useState('')
  const fileInputRef = useRef(null)

  const handleClear = () => {
    onClearData()
    setConfirmingClear(false)
  }

  const handleFileChosen = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImportError('')

    try {
      const text = await file.text()
      const parsed = parseBackupJson(text)
      setPendingImport(parsed)
    } catch (error) {
      setImportError(error.message || 'Não deu pra ler esse arquivo.')
    }
  }

  const confirmImport = () => {
    onImportBackup(pendingImport)
    setPendingImport(null)
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
            <span>Projeto: David Neves de Figueiredo, Samia Albuquerque, Yara Vaz da Silva e Jhemeson Conde, em parceria com a USF.</span>
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

        <button type="button" className="settings-option clay-tap" onClick={() => fileInputRef.current?.click()}>
          <span className="settings-option-icon">
            <UploadIcon size={18} />
          </span>
          <div className="settings-option-texts">
            <strong>Importar backup</strong>
            <span>Carrega um arquivo de backup (deste ou de outro aparelho). O que já existe é atualizado, o resto é adicionado.</span>
          </div>
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChosen} />
        {importError && (
          <p className="settings-import-error">
            <AlertIcon size={16} />
            <span>{importError}</span>
          </p>
        )}

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

      <ConfirmDialog
        open={pendingImport !== null}
        title="Importar backup"
        message={
          pendingImport
            ? `Encontrado ${pendingImport.vaccines.length} vacina${pendingImport.vaccines.length === 1 ? '' : 's'} e ${pendingImport.history.length} registro${pendingImport.history.length === 1 ? '' : 's'} de histórico nesse arquivo. O que já existir aqui com o mesmo id é atualizado, o resto é adicionado. Continuar?`
            : ''
        }
        confirmLabel="Importar"
        onConfirm={confirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  )
}

export default SettingsScreen
