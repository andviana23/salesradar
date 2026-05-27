import { Sale } from '../entities/Sale'

export interface SaleFilter {
  userId: string
  from: Date
  to: Date
  product?: string
  seller?: string
}

export interface ISaleRepository {
  findMany(filter: SaleFilter): Promise<Sale[]>
  saveMany(sales: Sale[]): Promise<void>
  deleteBySource(sourceId: string): Promise<void>
  sumAmountByPeriod(filter: SaleFilter): Promise<number>
  topProducts(filter: SaleFilter, limit: number): Promise<{ product: string; total: number }[]>
  topSellers(filter: SaleFilter, limit: number): Promise<{ seller: string; total: number }[]>
  revenueByDay(filter: SaleFilter): Promise<{ date: string; total: number }[]>
}
