import HomeScreen from './screens/HomeScreen/HomeScreen'
import VacinacaoScreen from './screens/VacinacaoScreen/VacinacaoScreen'
import ContagemDoDiaScreen from './screens/ContagemDoDiaScreen/ContagemDoDiaScreen'
import CadastroVacinasScreen from './screens/CadastroVacinasScreen/CadastroVacinasScreen'
import FinalizarDiaScreen from './screens/FinalizarDiaScreen/FinalizarDiaScreen'
import HistoricoScreen from './screens/HistoricoScreen/HistoricoScreen'
import VaccineInfoScreen from './screens/VaccineInfoScreen/VaccineInfoScreen'
import VaccineFormScreen from './screens/VaccineFormScreen/VaccineFormScreen'
import VaccineSearchScreen from './screens/VaccineSearchScreen/VaccineSearchScreen'
import SettingsScreen from './screens/SettingsScreen/SettingsScreen'
import { exportBackupJson } from './utils/exportData'
import { SCREEN, useAppController } from './hooks/useAppController'
import './App.css'

function App() {
  const {
    screen,
    setScreen,
    setActiveIndex,
    state,
    activeIndex,
    infoVaccineId,
    editingVaccineId,
    vaccines,
    history,
    totalAppliedToday,
    formattedDate,
    removeVaccine,
    changeDoses,
    finalizeDay,
    deleteHistoryRecord,
    importBackup,
    clearAllData,
    openInfo,
    openNewVaccineForm,
    openEditVaccineForm,
    saveVaccineForm,
    goPrevVaccine,
    goNextVaccine,
  } = useAppController()

  const renderVacinacao = () => (
    <VacinacaoScreen
      totalAppliedToday={totalAppliedToday}
      formattedDate={formattedDate}
      onBack={() => setScreen(SCREEN.HOME)}
      onOpenContagem={() => setScreen(SCREEN.CONTAGEM)}
      onOpenCadastro={() => setScreen(SCREEN.CADASTRO)}
      onOpenFinalizar={() => setScreen(SCREEN.FINALIZAR)}
      onOpenHistorico={() => setScreen(SCREEN.HISTORICO)}
      onOpenSearch={() => setScreen(SCREEN.SEARCH)}
    />
  )

  let activeScreen = (
    <HomeScreen onOpenVacinacao={() => setScreen(SCREEN.VACINACAO)} onOpenSettings={() => setScreen(SCREEN.SETTINGS)} />
  )

  if (screen === SCREEN.VACINACAO) {
    activeScreen = renderVacinacao()
  } else if (screen === SCREEN.CONTAGEM) {
    activeScreen = (
      <ContagemDoDiaScreen
        vaccines={vaccines}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onPrev={goPrevVaccine}
        onNext={goNextVaccine}
        onIncrement={(id) => changeDoses(id, 1)}
        onDecrement={(id) => changeDoses(id, -1)}
        onBack={() => setScreen(SCREEN.VACINACAO)}
        onOpenInfo={openInfo}
        onOpenCadastro={() => setScreen(SCREEN.CADASTRO)}
        onOpenSearch={() => setScreen(SCREEN.SEARCH)}
      />
    )
  } else if (screen === SCREEN.CADASTRO) {
    activeScreen = (
      <CadastroVacinasScreen
        vaccines={vaccines}
        onRemove={removeVaccine}
        onOpenNew={openNewVaccineForm}
        onOpenEdit={openEditVaccineForm}
        onBack={() => setScreen(SCREEN.VACINACAO)}
      />
    )
  } else if (screen === SCREEN.VACCINE_FORM) {
    const vaccine = editingVaccineId ? vaccines.find((item) => item.id === editingVaccineId) : null
    activeScreen = <VaccineFormScreen vaccine={vaccine} onSave={saveVaccineForm} onBack={() => setScreen(SCREEN.CADASTRO)} />
  } else if (screen === SCREEN.FINALIZAR) {
    activeScreen = (
      <FinalizarDiaScreen vaccines={vaccines} onFinalize={finalizeDay} onBack={() => setScreen(SCREEN.VACINACAO)} />
    )
  } else if (screen === SCREEN.HISTORICO) {
    activeScreen = <HistoricoScreen history={history} onDeleteRecord={deleteHistoryRecord} onBack={() => setScreen(SCREEN.VACINACAO)} />
  } else if (screen === SCREEN.SEARCH) {
    activeScreen = <VaccineSearchScreen vaccines={vaccines} onOpenInfo={openInfo} onBack={() => setScreen(SCREEN.VACINACAO)} />
  } else if (screen === SCREEN.INFO) {
    const vaccine = vaccines.find((item) => item.id === infoVaccineId)
    activeScreen = vaccine ? <VaccineInfoScreen vaccine={vaccine} onBack={() => setScreen(SCREEN.CONTAGEM)} /> : renderVacinacao()
  } else if (screen === SCREEN.SETTINGS) {
    activeScreen = (
      <SettingsScreen
        onClearData={clearAllData}
        onExportBackup={() => exportBackupJson(state)}
        onImportBackup={importBackup}
        onBack={() => setScreen(SCREEN.HOME)}
      />
    )
  }

  return <div className="app-shell">{activeScreen}</div>
}

export default App
