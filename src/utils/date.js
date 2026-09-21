// Formata uma data ISO (yyyy-mm-dd) pro padrao brasileiro dd/mm/aaaa.
// Usa meio-dia UTC pra nao correr risco de virar o dia por causa do fuso.
export function formatDateBR(isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(`${isoDate}T12:00:00`))
}
