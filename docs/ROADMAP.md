# Roadmap — SalesRadar MVP 1.0

**Meta:** entregar um dashboard de vendas funcional, com importação de dados, KPIs, gráficos e relatório automático por WhatsApp.

**Estimativa total:** 5 semanas

---

## Visão geral das fases

```
Fase 1 — Setup & Base         (Semana 1)
Fase 2 — Importação de dados  (Semana 2)
Fase 3 — Dashboard & KPIs     (Semana 3)
Fase 4 — Relatório WhatsApp   (Semana 4)
Fase 5 — Polish & Deploy      (Semana 5)
```

---

## Fase 1 — Setup & Base de autenticação
**Semana 1**

### Backend
- [ ] Inicializar projeto Node.js + TypeScript + Express
- [ ] Configurar Prisma + PostgreSQL (Neon)
- [ ] Criar schema inicial (users, data_sources, sales)
- [ ] Rodar primeira migration
- [ ] Endpoint `POST /auth/register`
- [ ] Endpoint `POST /auth/login` (JWT)
- [ ] Middleware de autenticação JWT
- [ ] Estrutura de pastas (routes / controllers / services / prisma)

### Frontend
- [ ] Inicializar Next.js 15 + TypeScript
- [ ] Instalar e configurar MUI v6 + tema customizado
- [ ] Configurar TanStack Query + Zustand
- [ ] Tela de Login (e-mail + senha)
- [ ] Tela de Cadastro
- [ ] Proteção de rotas autenticadas
- [ ] Layout base: AppBar + Sidebar + área de conteúdo

### Infra
- [ ] Monorepo configurado (apps/web + apps/api)
- [ ] `.env.example` documentado para os dois apps
- [ ] Scripts `dev`, `build`, `start` no `package.json` raiz

**Critério de aceite:** usuário consegue criar conta, fazer login e ver o dashboard vazio.

---

## Fase 2 — Importação de dados
**Semana 2**

### Backend
- [ ] Endpoint `POST /sources` — cadastrar fonte de dados
- [ ] Parser de CSV (multer + papaparse)
- [ ] Integração Google Sheets API v4 (leitura via URL pública)
- [ ] Mapeamento de colunas (data, valor, produto, vendedor)
- [ ] Endpoint `POST /sources/:id/sync` — força sincronização
- [ ] Job de sincronização automática a cada 30 min (node-cron)
- [ ] Endpoint `GET /sources` — listar fontes do usuário

### Frontend
- [ ] Tela de onboarding — passo 1: escolher tipo (CSV ou Google Sheets)
- [ ] Tela de onboarding — passo 2: upload CSV ou colar URL Sheets
- [ ] Tela de onboarding — passo 3: mapear colunas (preview dos dados)
- [ ] Tela de onboarding — passo 4: confirmação e primeira importação
- [ ] Indicador de status de sincronização no header (Chip MUI)
- [ ] Botão "Sincronizar agora" na tela de configurações

**Critério de aceite:** usuário importa CSV com 1.000 linhas e vê os dados carregados em menos de 5s.

---

## Fase 3 — Dashboard & KPIs
**Semana 3**

### Backend
- [ ] Endpoint `GET /dashboard/kpis` — faturamento, ticket médio, qtd vendas, top produto
- [ ] Lógica de período: today / 7d / 30d / custom (query params)
- [ ] Lógica de comparativo: cálculo de variação % vs período anterior
- [ ] Endpoint `GET /dashboard/chart/revenue` — série temporal de faturamento
- [ ] Endpoint `GET /dashboard/chart/products` — top 5 produtos
- [ ] Endpoint `GET /dashboard/chart/sellers` — vendas por vendedor (se coluna existir)

### Frontend
- [ ] Componente `KpiCard` (conforme Design System)
- [ ] Grid de 4 KPIs no topo do dashboard
- [ ] Filtro de período com `ToggleButtonGroup` MUI
- [ ] Date range picker customizado para período personalizado
- [ ] Gráfico de linha — faturamento por período (Recharts `LineChart`)
- [ ] Gráfico de barras — top 5 produtos (Recharts `BarChart`)
- [ ] Gráfico de pizza — vendas por vendedor (Recharts `PieChart`)
- [ ] Estado de loading com `Skeleton` MUI
- [ ] Estado vazio quando não há dados

**Critério de aceite:** ao trocar o filtro de período, todos os KPIs e gráficos atualizam sem recarregar a página.

---

## Fase 4 — Relatório automático por WhatsApp
**Semana 4**

### Backend
- [ ] Endpoint `PUT /settings/report` — salvar número WhatsApp + horário
- [ ] Endpoint `POST /report/send` — dispara relatório manual
- [ ] Endpoint `GET /report/preview` — retorna texto do relatório para preview
- [ ] Job agendado (node-cron) — dispara relatório no horário configurado
- [ ] Montagem do relatório: faturamento do dia, comparativo D-1, top 3 produtos
- [ ] Geração do link `wa.me` com mensagem pré-montada (MVP sem API externa)

### Frontend
- [ ] Tela de configurações — campo número WhatsApp + validação
- [ ] Seletor de horário para envio diário (`TimePicker` MUI free)
- [ ] Preview do relatório — mostra exatamente o texto que será enviado
- [ ] Botão "Testar relatório agora" → abre WhatsApp com mensagem
- [ ] Toggle para ativar/desativar envio automático

**Critério de aceite:** ao clicar em "Testar relatório", WhatsApp abre com mensagem correta pré-preenchida.

---

## Fase 5 — Polish & Deploy
**Semana 5**

### Qualidade
- [ ] Responsividade mobile revisada em todas as telas
- [ ] Estados de erro tratados (falha na sincronização, credenciais inválidas)
- [ ] Validações de formulário com feedback visual (MUI `FormHelperText`)
- [ ] Loading states em todas as ações assíncronas
- [ ] Testes manuais do fluxo completo (onboarding → dashboard → relatório)

### Segurança
- [ ] Rate limiting nas rotas públicas (`/auth/login`, `/auth/register`)
- [ ] Validação de input no backend (Zod)
- [ ] Variáveis sensíveis apenas no servidor (nunca expostas no frontend)
- [ ] Dados de vendas inacessíveis sem JWT válido

### Deploy
- [ ] Deploy do frontend na Vercel
- [ ] Deploy do backend no Railway
- [ ] Banco Neon configurado em produção
- [ ] Variáveis de ambiente configuradas nos dois serviços
- [ ] Domínio customizado (opcional)
- [ ] Smoke test em produção — fluxo completo

### Documentação
- [ ] README com instruções de setup completas
- [ ] `.env.example` atualizado
- [ ] Vídeo de demonstração (screen recording do fluxo principal)

**Critério de aceite:** URL pública funcional, onboarding → dashboard → relatório WhatsApp operando em produção.

---

## Marcos

| Marco | Entrega | Semana |
|-------|---------|--------|
| M1 | Auth + layout base funcionando | 1 |
| M2 | CSV importado e dados no banco | 2 |
| M3 | Dashboard com KPIs e gráficos | 3 |
| M4 | Relatório WhatsApp configurável | 4 |
| M5 | MVP 1.0 em produção | 5 |

---

## Fora do MVP 1.0 (backlog v2)

- Integração Evolution API (WhatsApp real, sem link manual)
- Múltiplas fontes de dados simultâneas
- Múltiplos usuários por conta
- Relatório em PDF
- Alertas de metas (ex: "você bateu 80% da meta do mês")
- App mobile (React Native)
- Integração com PDV ou ERP
