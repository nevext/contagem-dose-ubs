// Contas de estoque em frasco multi-dose: a vacina guarda quantos frascos
// tem e quantas doses saem de cada um. A contagem do dia continua sendo por
// dose aplicada (cada picada), e o frasco so "fecha" quando completa o
// multiplo de doses dele. Tudo derivado so de frascos/dosesPorFrasco/
// appliedToday, sem precisar guardar em que frasco cada dose caiu.

// Deixa uma vacina (nova, de um backup importado, ou salva antes dessa
// funcionalidade existir) sempre com frascos e dosesPorFrasco definidos.
// Vacinas antigas so tinham "initialStock" em doses com frasco de 1 dose.
export function normalizeVaccine(vaccine) {
  if (vaccine.frascos !== undefined && vaccine.dosesPorFrasco !== undefined) return vaccine

  const dosesPorFrasco = vaccine.dosesPorFrasco ?? 1
  const frascos = vaccine.frascos ?? vaccine.initialStock ?? 0
  return { ...vaccine, frascos, dosesPorFrasco }
}

export function totalDoses(vaccine) {
  return vaccine.frascos * vaccine.dosesPorFrasco
}

export function availableDoses(vaccine) {
  return totalDoses(vaccine) - vaccine.appliedToday
}

export function frascosUsados(vaccine) {
  if (vaccine.appliedToday <= 0) return 0
  return Math.ceil(vaccine.appliedToday / vaccine.dosesPorFrasco)
}

// Quantas doses ja saíram do frasco que esta aberto agora (0 se nenhum
// frasco foi aberto ainda).
export function doseNoFrascoAtual(vaccine) {
  const usados = frascosUsados(vaccine)
  if (usados === 0) return 0
  return vaccine.appliedToday - (usados - 1) * vaccine.dosesPorFrasco
}
