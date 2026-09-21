// Exporta os dados do app pro celular baixar como arquivo, servindo dois
// propositos: backup contra perda de dado (localStorage pode ser limpo sem
// aviso) e a planilha que a equipe vai precisar pra analisar a semana de
// validacao depois.

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10)
}

export function exportBackupJson(state) {
  const content = JSON.stringify(state, null, 2)
  downloadFile(content, `backup-contagem-doses-${todayStamp()}.json`, 'application/json')
}

// Le um arquivo de backup exportado (deste ou de outro aparelho) e devolve
// vacinas e historico prontos pra mesclar no estado atual. Lanca erro se o
// arquivo nao for um JSON valido ou nao tiver o formato esperado.
export function parseBackupJson(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Esse arquivo não é um backup válido (JSON ilegível).')
  }

  const vaccines = Array.isArray(parsed?.vaccines) ? parsed.vaccines : Array.isArray(parsed) ? parsed : null
  const history = Array.isArray(parsed?.history) ? parsed.history : []

  if (!vaccines) {
    throw new Error('Esse arquivo não parece ser um backup desse app.')
  }

  return { vaccines, history }
}

function csvCell(value) {
  const text = String(value)
  return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function exportHistoricoCsv(history) {
  const header = ['Data', 'Vacina', 'Estoque esperado', 'Estoque contado', 'Diferença', 'Situação']
  const rows = [header]

  history
    .slice()
    .reverse()
    .forEach((record) => {
      record.entries.forEach((entry) => {
        rows.push([
          record.date,
          entry.name,
          entry.expected,
          entry.counted,
          entry.diff,
          entry.diff === 0 ? 'Bateu certinho' : entry.diff > 0 ? 'Faltaram doses' : 'Sobraram doses',
        ])
      })
    })

  const csv = rows.map((row) => row.map(csvCell).join(';')).join('\r\n')
  const BOM = String.fromCharCode(0xfeff)
  downloadFile(BOM + csv, `historico-contagem-doses-${todayStamp()}.csv`, 'text/csv;charset=utf-8')
}
