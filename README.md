# SalesRadar

Dashboard de vendas que transforma dados de planilha Google Sheets ou CSV em KPIs visuais, com relatório diário automático por WhatsApp.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=flat-square)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![MUI](https://img.shields.io/badge/MUI-v6-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com)

---

## O que é

SalesRadar conecta a planilha que o cliente já usa (Google Sheets ou CSV), exibe os números organizados em tempo real e envia um resumo por WhatsApp todo dia no horário configurado. Zero mudança de hábito para o cliente.

**Problema resolvido:** donos de pequenos negócios controlam vendas em planilhas mas nunca têm visibilidade rápida — precisam abrir, filtrar e calcular manualmente toda vez.

---

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| Importação | Upload CSV ou conexão Google Sheets via URL |
| KPIs | Faturamento, ticket médio, total de vendas, top produto |
| Gráficos | Faturamento por período, vendas por produto, por vendedor |
| Filtros | Hoje, 7 dias, 30 dias, intervalo customizado |
| Comparativo | Variação % em relação ao período anterior |
| Relatório | Resumo diário automático via WhatsApp no horário configurado |

---

## Stack

**Front-end**
- Next.js 15 (App Router)
- TypeScript
- MUI v6 (componentes gratuitos)
- Recharts (gráficos)
- TanStack Query v5
- Zustand

**Back-end**
- Node.js 20 + Express
- TypeScript
- Prisma ORM
- PostgreSQL 16 (Neon)
- node-cron (relatório agendado)
- Google Sheets API v4

**Infra**
- Vercel (frontend)
- Railway (backend)
- Neon (banco)

---

## Estrutura do projeto

```
salesradar/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node.js backend
├── packages/
│   └── types/        # tipos compartilhados
├── docs/
│   ├── DESIGN_SYSTEM.md
│   └── ROADMAP.md
├── PRD.md
└── README.md
```

---

## Início rápido

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+ (ou conta Neon)
- Conta Google Cloud (para Google Sheets API)

### Setup

```bash
# Clone
git clone https://github.com/andviana23/salesradar.git
cd salesradar

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Editar os dois .env com suas credenciais

# Rodar migrations
cd apps/api && npx prisma migrate dev

# Subir em desenvolvimento
npm run dev   # sobe web + api simultaneamente
```

**Frontend:** http://localhost:3000
**Backend:** http://localhost:3001

---

## Documentação

- [PRD.md](./PRD.md) — requisitos, modelo de dados, endpoints
- [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) — tokens, paleta, componentes
- [docs/ROADMAP.md](./docs/ROADMAP.md) — roadmap MVP 1.0

---

## Autor

**Andrey Viana** — Full-Stack Freelancer

[![Portfolio](https://img.shields.io/badge/Portfólio-000000?style=flat-square&logo=vercel&logoColor=white)](https://protifolio-three-smoky.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andreyvs-viana/)
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:andviana.a@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/5531993729202)
