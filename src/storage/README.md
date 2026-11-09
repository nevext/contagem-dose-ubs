# Camada de persistência (cliente)

Este projeto **não usa servidor nem banco de dados**. Toda a “base” vive no **navegador** do celular/tablet da UBS.

| O quê | Onde |
| --- | --- |
| Estado da aplicação (vacinas + histórico) | `localStorage`, chave `contagem-dose-ubs` |
| Leitura na abertura do app | `loadAppState()` em `appState.js`, chamado em `useAppController` |
| Gravação após mudanças | `saveAppState()` no mesmo hook (`useEffect` em cima do estado) |
| Backup manual | JSON gerado/baixado em `src/utils/exportData.js` (Definições) |
| Relatório diário | CSV no dispositivo ao finalizar o dia |

Não há pastas `api/`, `server/` ou ORM — isso é intencional (app offline-first).
