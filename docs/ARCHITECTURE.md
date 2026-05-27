# Arquitetura — SalesRadar

## Visão geral

SalesRadar segue **Clean Architecture** (Robert C. Martin) combinada com princípios de **Domain-Driven Design** (DDD). A regra central: dependências apontam sempre para dentro — do framework ao domínio, nunca o contrário.

```
┌──────────────────────────────────────────────────────┐
│                  Presentation                        │  HTTP, Controllers, Middlewares
├──────────────────────────────────────────────────────┤
│                 Infrastructure                       │  Prisma, Google Sheets, WhatsApp
├──────────────────────────────────────────────────────┤
│                  Application                         │  Use Cases, Ports (interfaces)
├──────────────────────────────────────────────────────┤
│                    Domain                            │  Entities, Value Objects, Repos
└──────────────────────────────────────────────────────┘
         ↑ dependências apontam para cima (inward)
```

---

## Camadas do backend (`apps/api`)

### Domain — o núcleo, sem dependências externas

Contém as regras de negócio puras. Nenhuma importação de Express, Prisma ou qualquer lib externa.

**Entities** — objetos com identidade e ciclo de vida:

| Entidade | Responsabilidade |
|----------|-----------------|
| `User` | Usuário autenticado, configuração do relatório |
| `Sale` | Registro de venda importado |
| `DataSource` | Fonte de dados (CSV ou Google Sheets) |

**Value Objects** — imutáveis, sem identidade, validação embutida:

| Value Object | Regra |
|--------------|-------|
| `Email` | Formato válido, lowercase, trim |
| `Money` | Não negativo, arredondamento em centavos |

**Repository Interfaces** — contratos que a infraestrutura implementa:
- `IUserRepository`
- `ISaleRepository` — inclui queries analíticas (topProducts, revenueByDay)
- `IDataSourceRepository`

---

### Application — orquestra o domínio

Use cases são a única entrada para lógica de negócio. Cada use case tem uma única responsabilidade.

| Use Case | Entrada | Saída |
|----------|---------|-------|
| `LoginUseCase` | email + password | JWT token |
| `RegisterUseCase` | email + password | void |
| `GetKpisUseCase` | SaleFilter | KpisOutput |
| `SendReportUseCase` | userId | link WhatsApp |
| `SyncDataSourceUseCase` | sourceId | void |

**Ports** — interfaces para serviços externos (invertendo dependência):
- `IWhatsAppPort` — buildLink / send
- `IGoogleSheetsPort` — fetchRows / getHeaders
- `ICsvParserPort` — parse / getHeaders

---

### Infrastructure — implementa contratos do domínio/application

| Adapter | Implementa |
|---------|-----------|
| `PrismaUserRepository` | `IUserRepository` |
| `PrismaSaleRepository` | `ISaleRepository` |
| `PrismaDataSourceRepository` | `IDataSourceRepository` |
| `WhatsAppAdapter` | `IWhatsAppPort` |
| `GoogleSheetsAdapter` | `IGoogleSheetsPort` |
| `CsvParserAdapter` | `ICsvParserPort` |
| `ReportScheduler` | node-cron para envio diário |

---

### Presentation — HTTP

- `server.ts` — Express app, middleware global
- `routes/` — agrupamento por domínio (auth, analytics, sources, report)
- `controllers/` — recebe HTTP, chama use case, responde JSON
- `middlewares/auth.ts` — valida JWT, injeta `userId` no request

---

## Estrutura de pastas

```
apps/api/src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Sale.ts
│   │   └── DataSource.ts
│   ├── value-objects/
│   │   ├── Email.ts
│   │   └── Money.ts
│   ├── repositories/
│   │   ├── IUserRepository.ts
│   │   ├── ISaleRepository.ts
│   │   └── IDataSourceRepository.ts
│   ├── services/
│   │   └── SaleAggregator.ts
│   └── events/
│       └── SalesImported.ts
│
├── application/
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── LoginUseCase.ts
│   │   │   └── RegisterUseCase.ts
│   │   ├── data-source/
│   │   │   ├── ConnectCsvUseCase.ts
│   │   │   ├── ConnectSheetsUseCase.ts
│   │   │   └── SyncDataSourceUseCase.ts
│   │   ├── analytics/
│   │   │   ├── GetKpisUseCase.ts
│   │   │   ├── GetRevenueChartUseCase.ts
│   │   │   └── GetTopProductsUseCase.ts
│   │   └── report/
│   │       ├── SendReportUseCase.ts
│   │       └── ConfigureReportUseCase.ts
│   ├── dtos/
│   └── ports/
│       ├── IWhatsAppPort.ts
│       ├── IGoogleSheetsPort.ts
│       └── ICsvParserPort.ts
│
├── infrastructure/
│   ├── database/
│   │   ├── repositories/
│   │   │   ├── PrismaUserRepository.ts
│   │   │   ├── PrismaSaleRepository.ts
│   │   │   └── PrismaDataSourceRepository.ts
│   ├── external/
│   │   ├── WhatsAppAdapter.ts
│   │   ├── GoogleSheetsAdapter.ts
│   │   └── CsvParserAdapter.ts
│   └── scheduler/
│       └── ReportScheduler.ts
│
└── presentation/
    └── http/
        ├── routes/
        ├── controllers/
        ├── middlewares/
        │   └── auth.ts
        └── server.ts
```

---

## Camadas do frontend (`apps/web`)

O frontend adota a mesma separação de responsabilidades adaptada para React/Next.js.

```
apps/web/src/
├── app/                          # Next.js App Router (rotas e páginas)
│   ├── (auth)/login
│   ├── (auth)/register
│   ├── (dashboard)/dashboard
│   ├── (dashboard)/onboarding
│   └── (dashboard)/settings
│
├── domain/                       # Tipos e interfaces de negócio (frontend)
│   └── entities/
│
├── application/                  # Hooks e estado global
│   ├── hooks/                    # useKpis, useDataSource, useReport
│   └── stores/                   # Zustand stores (auth, ui)
│
├── infrastructure/               # Comunicação com a API
│   └── api/
│       └── client.ts             # fetch wrapper com JWT automático
│
└── presentation/                 # Componentes visuais
    ├── components/
    │   ├── ui/                   # Primitivos (KpiCard, PageHeader...)
    │   ├── dashboard/            # Gráficos e KPIs
    │   └── onboarding/           # Fluxo de conexão de dados
    ├── layouts/
    └── theme/                    # Tema MUI + cores Recharts
```

---

## Pacote compartilhado (`packages/shared`)

Tipos TypeScript compartilhados entre `api` e `web`. Garante que request/response estejam em sincronia sem duplicação.

```
packages/shared/src/types/
├── Auth (LoginRequest, LoginResponse, RegisterRequest)
├── Analytics (KpisResponse, RevenuePoint, ProductPoint)
├── DataSource (DataSourceResponse, ConnectSourceRequest)
└── Report (ReportSettingsRequest, ReportPreviewResponse)
```

---

## Regras de dependência

| Camada | Pode importar de |
|--------|-----------------|
| Domain | Ninguém |
| Application | Domain |
| Infrastructure | Domain + Application |
| Presentation | Application + Infrastructure |
| Frontend hooks | `@salesradar/shared` + `infrastructure/api` |
| Frontend components | `application/hooks` + `presentation/theme` |

**Proibido:**
- Domain importar Prisma, Express ou qualquer lib
- Use Case importar `PrismaClient` diretamente — sempre via interface
- Componente React fazer fetch direto — sempre via hook

---

## Fluxo de dados — exemplo: carregar KPIs

```
Usuário troca filtro de período
  → useKpis(filter)                        [application/hooks]
    → api.get('/dashboard/kpis?...')        [infrastructure/api/client]
      → GET /dashboard/kpis                 [presentation/http/routes]
        → KpisController.handle()           [presentation/http/controllers]
          → GetKpisUseCase.execute(filter)  [application/use-cases]
            → ISaleRepository.findMany()    [domain/repositories — interface]
              → PrismaSaleRepository        [infrastructure — implementação]
                → Prisma query → PostgreSQL
          ← KpisOutput
        ← 200 JSON
      ← KpisResponse (shared types)
    ← KpisResponse
  → React re-render com novos KPIs
```
