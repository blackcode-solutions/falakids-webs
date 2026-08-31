# FalaKids — telas que faltavam

Este pacote adiciona as telas que estavam como placeholders no projeto anterior, com base no protótipo enviado:

## Área da fonoaudióloga
- `/patients/new` — cadastro de novo paciente
- `/settings` — configurações da conta/clínica

## Área do responsável
- `/parent/tasks` — tarefas para casa
- `/parent/progress` — progresso do paciente
- `/parent/messages` — conversa com a fonoaudióloga
- `/parent/profile` — perfil do responsável

Os dados são mockados em `lib/data.ts`, seguindo o conteúdo visual do protótipo. Os formulários e mensagens possuem interações locais para demonstração, mas ainda não estão conectados a banco/API/autenticação.

### Executar
```bash
npm install
npm run dev
```
