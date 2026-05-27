# PRD — SalesRadar

## Visão geral

Dashboard de vendas que transforma dados de planilha Google Sheets ou CSV em KPIs visuais em tempo real, com envio automático de relatório diário por WhatsApp.

**Problema resolvido:** donos de pequenos negócios controlam vendas em planilhas mas nunca têm visibilidade rápida do que está acontecendo — precisam abrir, filtrar e calcular manualmente. O relatório diário nunca sai porque dá trabalho.

**Proposta de valor:** conecta a planilha que o cliente já usa, mostra os números organizados em tempo real e envia um resumo por WhatsApp todo dia no horário configurado. Zero mudança de hábito para o cliente.

---

## Usuários

| Perfil | Descrição |
|--------|-----------|
| Dono do negócio | Conecta a planilha, visualiza dashboard, recebe relatório no WhatsApp |
| Gestor / sócio | Acessa o mesmo dashboard (multi-usuário futuro) |

---

## Escopo — MVP

### Conexão de dados
- Upload de arquivo CSV **ou** conexão com Google Sheets via URL pública
- Mapeamento de colunas: data, produto, valor, quantidade, vendedor (opcional)
- Atualização automática a cada 30 minutos (polling)
- Preview dos dados antes de confirmar importação

### Dashboard
- KPIs principais: faturamento total, ticket médio, total de vendas, produto mais vendido
- Gráfico de faturamento por período (dia / semana / mês)
- Gráfico de vendas por produto (top 5)
- Gráfico de vendas por vendedor (se coluna existir)
- Filtro de período: hoje, 7 dias, 30 dias, intervalo customizado
- Comparativo com período anterior (% de variação)

### Relatório automático por WhatsApp
- Configuração: número de WhatsApp destino + horário de envio
- Conteúdo do relatório: faturamento do dia, comparativo com dia anterior, top 3 produtos
- Formato: mensagem de texto limpa, legível no WhatsApp
- Envio via WhatsApp Web link (MVP) ou Evolution API (v2)

### Autenticação
- Login com e-mail e senha
- Sessão persistente via JWT

### Fora do escopo (MVP)
- Integração direta com PDV ou ERP
- Múltiplas planilhas simultâneas
- Relatório em PDF
- App mobile nativo

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15 + TypeScript + MUI v6 (free) |
| Gráficos | Recharts |
| Backend | Node.js 20 + Express + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL 16 (Neon) |
| Scheduler | node-cron (relatório diário) |
| Google Sheets | Google Sheets API v4 |
| WhatsApp | wa.me link (MVP) / Evolution API (v2) |
| Deploy | Vercel (front) + Railway (back) |

---

## Modelo de dados

```sql
users (
  id          UUID PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  whatsapp    TEXT,
  report_time TIME DEFAULT '08:00',
  created_at  TIMESTAMP DEFAULT now()
)

data_sources (
  id          UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  type        TEXT,          -- 'csv' | 'google_sheets'
  url         TEXT,
  col_date    TEXT,          -- nome da coluna de data
  col_value   TEXT,          -- nome da coluna de valor
  col_product TEXT,
  col_seller  TEXT,
  last_sync   TIMESTAMP,
  created_at  TIMESTAMP DEFAULT now()
)

sales (
  id          UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  source_id   UUID REFERENCES data_sources(id),
  sold_at     DATE NOT NULL,
  product     TEXT,
  seller      TEXT,
  quantity    INTEGER DEFAULT 1,
  amount      NUMERIC(10,2) NOT NULL,
  imported_at TIMESTAMP DEFAULT now()
)
```

---

## API — endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/login` | Login | Não |
| POST | `/sources` | Conecta planilha/CSV | Sim |
| POST | `/sources/:id/sync` | Força sincronização | Sim |
| GET | `/dashboard/kpis` | KPIs do período | Sim |
| GET | `/dashboard/chart/revenue` | Dados gráfico faturamento | Sim |
| GET | `/dashboard/chart/products` | Dados gráfico produtos | Sim |
| GET | `/dashboard/chart/sellers` | Dados gráfico vendedores | Sim |
| PUT | `/settings/report` | Configura WhatsApp + horário | Sim |
| POST | `/report/send` | Dispara relatório manual | Sim |

---

## Telas

1. **Onboarding** — conectar planilha (upload CSV ou colar URL Google Sheets) + mapear colunas
2. **Dashboard** — KPIs + 3 gráficos + filtro de período
3. **Configurações** — WhatsApp destino + horário do relatório diário
4. **Login** — e-mail + senha

---

## Critérios de aceite

- [ ] CSV com até 10.000 linhas importa em menos de 5s
- [ ] KPIs atualizam ao trocar o filtro de período sem recarregar a página
- [ ] Relatório WhatsApp dispara no horário configurado (± 2 min)
- [ ] Dados de vendas não são acessíveis sem autenticação
- [ ] Google Sheets sincroniza automaticamente a cada 30 min
- [ ] Comparativo com período anterior exibe variação % correta

---

## Entregáveis

- Código-fonte completo (repositório GitHub)
- Deploy funcional (URL pública)
- README com instruções de setup
- `.env.example` documentado
- Vídeo curto de demonstração (opcional, para portfólio)

---

## Referências visuais

Inspiração: Metabase simplificado, Notion + Recharts para os gráficos.
