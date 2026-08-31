# FalaKids — Next.js

Projeto organizado a partir dos componentes enviados no `falakids-page.zip`, mantendo a implementação visual existente e transformando-a em uma estrutura navegável de Next.js App Router.

## Rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## O que já estava implementado

- Login
- Dashboard da fonoaudióloga
- Pacientes
- Perfil do paciente com abas
- Biblioteca de atividades
- Criador de sessão
- Estado/tela de sessão concluída dentro do criador
- Tarefas
- Relatórios / evolução
- Mensagens
- Clínica
- Início do responsável
- Gamificação / conquistas
- Componentes compartilhados: sidebar, sidebar do responsável, topbar, logo, mascote, ícones, gráficos e dados mock

## Páginas que faltam para fechar a navegação

### Fonoaudióloga
1. Configurações (`/settings`) — placeholder incluído.
2. Novo paciente (`/patients/new`) — placeholder incluído; o botão existe na tela de Pacientes, mas o formulário não estava no material enviado.

### Responsável
1. Tarefas (`/parent/tasks`)
2. Progresso (`/parent/progress`)
3. Mensagens (`/parent/messages`)
4. Perfil (`/parent/profile`)

Essas quatro rotas estão como placeholders para a navegação não quebrar.

> Observação: a tela "Sessão concluída" já existe no componente `SessionBuilderPage` como um estado após concluir a sessão, então não foi duplicada como uma página separada.
