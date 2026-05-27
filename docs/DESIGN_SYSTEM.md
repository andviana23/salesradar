# Design System — SalesRadar

Stack de UI: **MUI v6 (free tier)** + **Recharts** + **Tailwind utilitários opcionais**

---

## Paleta de cores

### Primárias

| Token | Hex | Uso |
|-------|-----|-----|
| `primary.main` | `#2563EB` | Botões principais, links, foco |
| `primary.light` | `#60A5FA` | Hover states, badges |
| `primary.dark` | `#1D4ED8` | Pressed state |
| `primary.contrastText` | `#FFFFFF` | Texto sobre primária |

### Semânticas

| Token | Hex | Uso |
|-------|-----|-----|
| `success.main` | `#16A34A` | KPI positivo, variação positiva |
| `error.main` | `#DC2626` | KPI negativo, variação negativa, erro |
| `warning.main` | `#D97706` | Alertas, dados pendentes |
| `info.main` | `#0891B2` | Informações neutras |

### Neutras

| Token | Hex | Uso |
|-------|-----|-----|
| `grey.50` | `#F9FAFB` | Background de página |
| `grey.100` | `#F3F4F6` | Background de cards |
| `grey.300` | `#D1D5DB` | Bordas, divisores |
| `grey.600` | `#4B5563` | Texto secundário |
| `grey.900` | `#111827` | Texto principal |

### Cores dos gráficos (Recharts)

```ts
export const CHART_COLORS = [
  '#2563EB', // azul — série principal
  '#16A34A', // verde — série secundária
  '#D97706', // âmbar — série terciária
  '#9333EA', // roxo — série quaternária
  '#0891B2', // ciano — série quinária
];
```

---

## Tipografia

MUI usa **Roboto** por padrão — sem custo adicional.

| Variante MUI | Tamanho | Peso | Uso |
|--------------|---------|------|-----|
| `h4` | 2rem | 700 | Título de página |
| `h5` | 1.5rem | 700 | Título de seção |
| `h6` | 1.25rem | 600 | Título de card |
| `subtitle1` | 1rem | 500 | Label de KPI |
| `body1` | 1rem | 400 | Texto corrido |
| `body2` | 0.875rem | 400 | Texto secundário, tabelas |
| `caption` | 0.75rem | 400 | Metadados, timestamps |

---

## Tema MUI

```ts
// apps/web/src/theme/index.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
    },
    success: { main: '#16A34A' },
    error:   { main: '#DC2626' },
    warning: { main: '#D97706' },
    info:    { main: '#0891B2' },
    background: {
      default: '#F9FAFB',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#111827',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E5E7EB',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});
```

---

## Componentes — catálogo

Todos os componentes abaixo são do **MUI free tier** (`@mui/material`).

### KPI Card

```tsx
// components/KpiCard.tsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;   // variação % em relação ao período anterior
  prefix?: string;  // ex: 'R$'
}

export function KpiCard({ label, value, delta, prefix }: KpiCardProps) {
  const positive = delta !== undefined && delta >= 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h5" mt={0.5}>
          {prefix && <span style={{ fontSize: '0.8em' }}>{prefix} </span>}
          {value}
        </Typography>
        {delta !== undefined && (
          <Box mt={1}>
            <Chip
              size="small"
              icon={positive ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${positive ? '+' : ''}${delta.toFixed(1)}%`}
              color={positive ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
```

### Status Badge

```tsx
// Variações de status de lead / sincronização
<Chip label="Sincronizado"  color="success" size="small" />
<Chip label="Sincronizando" color="warning" size="small" />
<Chip label="Erro"          color="error"   size="small" />
```

### Filtro de período

```tsx
// Usa ToggleButton (free MUI)
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const periods = [
  { value: 'today', label: 'Hoje' },
  { value: '7d',    label: '7 dias' },
  { value: '30d',   label: '30 dias' },
  { value: 'custom',label: 'Personalizado' },
];
```

### Tabela de dados

```tsx
// Table padrão do MUI (free) — NÃO usar DataGrid Pro
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@mui/material';
```

### Layout do dashboard

```tsx
// Usa Grid2 do MUI (free)
import Grid from '@mui/material/Grid2';

// KPIs — 4 colunas
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard ... /></Grid>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard ... /></Grid>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard ... /></Grid>
  <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard ... /></Grid>
</Grid>

// Gráficos — 2/3 + 1/3
<Grid container spacing={2} mt={2}>
  <Grid size={{ xs: 12, md: 8 }}>/* gráfico faturamento */</Grid>
  <Grid size={{ xs: 12, md: 4 }}>/* gráfico top produtos */</Grid>
</Grid>
```

---

## Ícones

Usar apenas `@mui/icons-material` (free).

| Ícone | Componente | Uso |
|-------|------------|-----|
| Faturamento | `AttachMoneyIcon` | KPI receita |
| Ticket médio | `ReceiptIcon` | KPI ticket |
| Vendas | `ShoppingCartIcon` | KPI quantidade |
| Top produto | `StarIcon` | KPI produto |
| Upload | `UploadFileIcon` | Importar CSV |
| Link | `LinkIcon` | Conectar Sheets |
| WhatsApp | `WhatsAppIcon` | Configuração relatório |
| Sync | `SyncIcon` | Sincronização |
| Download | `DownloadIcon` | Exportar |
| Settings | `SettingsIcon` | Configurações |

---

## Espaçamento

Seguir o sistema de 8px do MUI (`theme.spacing`).

| Token | Valor | Uso |
|-------|-------|-----|
| `spacing(1)` | 8px | Gap mínimo interno |
| `spacing(2)` | 16px | Padding de card, gap entre elementos |
| `spacing(3)` | 24px | Padding de seção |
| `spacing(4)` | 32px | Margem entre seções |

---

## Breakpoints

| Nome | Largura | Layout |
|------|---------|--------|
| `xs` | < 600px | 1 coluna, sidebar oculta |
| `sm` | 600px+ | 2 colunas |
| `md` | 900px+ | Layout completo |
| `lg` | 1200px+ | Layout expandido |

---

## Regras de uso MUI free

**Pode usar (free):**
- Todos os componentes de `@mui/material`
- Todos os ícones de `@mui/icons-material`
- `Table` + `TablePagination` para listas
- `ToggleButton`, `Chip`, `Badge`, `Avatar`
- `Drawer`, `AppBar`, `Toolbar` para layout

**Não usar (pago — MUI X Pro/Premium):**
- `DataGrid` com mais de 100 linhas — usar `Table` padrão
- `DateRangePicker` — usar dois `DatePicker` separados ou input customizado
- `Charts` do MUI X — usar **Recharts** (open source, gratuito)
