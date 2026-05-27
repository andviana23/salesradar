import { ISaleRepository, SaleFilter } from '@domain/repositories/ISaleRepository'

export interface KpisOutput {
  revenue: number
  revenueFormatted: string
  averageTicket: number
  totalSales: number
  topProduct: string | null
  revenueDelta: number
  salesDelta: number
}

export class GetKpisUseCase {
  constructor(private readonly saleRepo: ISaleRepository) {}

  async execute(filter: SaleFilter): Promise<KpisOutput> {
    const [sales, topProducts] = await Promise.all([
      this.saleRepo.findMany(filter),
      this.saleRepo.topProducts(filter, 1),
    ])

    const periodDays = Math.ceil((filter.to.getTime() - filter.from.getTime()) / 86_400_000)
    const prevFrom = new Date(filter.from.getTime() - periodDays * 86_400_000)
    const prevTo = new Date(filter.from)

    const [prevRevenue, prevSales] = await Promise.all([
      this.saleRepo.sumAmountByPeriod({ ...filter, from: prevFrom, to: prevTo }),
      this.saleRepo.findMany({ ...filter, from: prevFrom, to: prevTo }),
    ])

    const revenue = sales.reduce((s, sale) => s + Number(sale.amount.value), 0)
    const totalSales = sales.length
    const averageTicket = totalSales > 0 ? revenue / totalSales : 0

    const delta = (current: number, prev: number) =>
      prev === 0 ? 0 : ((current - prev) / prev) * 100

    return {
      revenue,
      revenueFormatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenue),
      averageTicket,
      totalSales,
      topProduct: topProducts[0]?.product ?? null,
      revenueDelta: delta(revenue, prevRevenue),
      salesDelta: delta(totalSales, prevSales.length),
    }
  }
}
