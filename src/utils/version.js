import packageJson from '../../package.json'

// Versao mostrada no app vem direto do package.json, pra nunca ficar
// desatualizada num lugar e esquecida em outro.
export const APP_VERSION = packageJson.version
