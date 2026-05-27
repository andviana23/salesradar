// Auth
export interface LoginRequest  { email: string; password: string }
export interface LoginResponse { token: string; userId: string }
export interface RegisterRequest { email: string; password: string }

// Analytics
export interface KpisResponse {
  revenue: number
  revenueFormatted: string
  averageTicket: number
  totalSales: number
  topProduct: string | null
  revenueDelta: number
  salesDelta: number
}

export interface RevenuePoint { date: string; total: number }
export interface ProductPoint  { product: string; total: number }
export interface SellerPoint   { seller: string; total: number }

export type Period = 'today' | '7d' | '30d' | 'custom'

export interface PeriodFilter {
  period: Period
  from?: string
  to?: string
}

// DataSource
export type SourceType = 'csv' | 'google_sheets'

export interface DataSourceResponse {
  id: string
  type: SourceType
  url?: string
  lastSync?: string
  status: 'synced' | 'syncing' | 'error'
}

export interface ConnectSourceRequest {
  type: SourceType
  url?: string
  columns: {
    date: string
    value: string
    product?: string
    seller?: string
  }
}

// Report
export interface ReportSettingsRequest {
  whatsapp: string
  reportTime: string
  reportActive: boolean
}

export interface ReportPreviewResponse {
  text: string
  link: string
}
