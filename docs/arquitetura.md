# Arquitetura — Contagem de Doses UBS

Documento para humanos e ferramentas que varrem o repositório. O resumo oficial continua no [README](../README.md).

## O que este projeto **não** é

- Não é Next.js: não espere `app/api/`, Route Handlers nem Server Actions.
- Não há PostgreSQL, SQLite, Firebase, Supabase etc. no `package.json`.
- Não há microserviço nem função serverless neste repo.

Alertas do tipo *“pasta de API não encontrada”* ou *“banco não detectado”* são **esperados** e indicam o desenho correto: **só frontend**.

## Onde ficam os dados

```
┌─────────────────────────────────────┐
│  React (telas em src/screens)       │
│           ▼                          │
│  useAppController (src/hooks)        │
│           ▼                          │
│  src/storage/appState.js             │
│           ▼                          │
│  localStorage["contagem-dose-ubs"]     │
└─────────────────────────────────────┘
```

1. Ao abrir o site, `useState(loadAppState)` lê o JSON do `localStorage`.
2. Cada alteração de estado dispara `saveAppState` (mesmo hook).
3. Trocar de aparelho: exportar/importar backup JSON nas Definições.

## Pastas relevantes (em vez de `api/`)

| Pasta | Papel |
| --- | --- |
| `src/storage/` | Persistência local (equivalente conceitual a “repositório”, mas no browser) |
| `src/hooks/` | Orquestração de estado e fluxo de telas |
| `src/utils/exportData.js` | Arquivos JSON/CSV no dispositivo |
| `architecture.json` | Metadados para varredura automática |

## Evolução

Sincronização central ou painel web exigiria **outro** repositório ou serviço (API + banco), fora do escopo atual.
