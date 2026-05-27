import { IUserRepository } from '@domain/repositories/IUserRepository'
import { ISaleRepository } from '@domain/repositories/ISaleRepository'
import { IWhatsAppPort } from '@application/ports/IWhatsAppPort'

export class SendReportUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly saleRepo: ISaleRepository,
    private readonly whatsApp: IWhatsAppPort,
  ) {}

  async execute(userId: string): Promise<string> {
    const user = await this.userRepo.findById(userId)
    if (!user?.whatsapp) throw new Error('WhatsApp not configured')

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today.getTime() + 86_400_000)
    const yesterday = new Date(today.getTime() - 86_400_000)

    const filter = { userId, from: today, to: tomorrow }
    const prevFilter = { userId, from: yesterday, to: today }

    const [sales, prevRevenue, topProducts] = await Promise.all([
      this.saleRepo.findMany(filter),
      this.saleRepo.sumAmountByPeriod(prevFilter),
      this.saleRepo.topProducts(filter, 3),
    ])

    const revenue = sales.reduce((s, sale) => s + Number(sale.amount.value), 0)
    const fmtBRL = (v: number) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
    const delta = prevRevenue === 0 ? 0 : ((revenue - prevRevenue) / prevRevenue) * 100
    const sign = delta >= 0 ? '+' : ''

    const productsText = topProducts.length
      ? topProducts.map((p, i) => `  ${i + 1}. ${p.product} — ${fmtBRL(p.total)}`).join('\n')
      : '  Sem dados'

    const text = [
      `📊 *Relatório SalesRadar — ${today.toLocaleDateString('pt-BR')}*`,
      ``,
      `💰 Faturamento: *${fmtBRL(revenue)}*`,
      `📈 vs ontem: *${sign}${delta.toFixed(1)}%*`,
      `🛒 Vendas: *${sales.length}*`,
      ``,
      `🏆 Top produtos:`,
      productsText,
    ].join('\n')

    const link = this.whatsApp.buildLink({ to: user.whatsapp, text })
    return link
  }
}
