import { Money } from '../value-objects/Money'

export interface SaleProps {
  id: string
  userId: string
  sourceId: string
  soldAt: Date
  product?: string
  seller?: string
  quantity: number
  amount: Money
  importedAt: Date
}

export class Sale {
  private constructor(private readonly props: SaleProps) {}

  static create(props: SaleProps): Sale {
    if (props.quantity < 1) throw new Error('Quantity must be at least 1')
    return new Sale(props)
  }

  get id() { return this.props.id }
  get userId() { return this.props.userId }
  get sourceId() { return this.props.sourceId }
  get soldAt() { return this.props.soldAt }
  get product() { return this.props.product }
  get seller() { return this.props.seller }
  get quantity() { return this.props.quantity }
  get amount() { return this.props.amount }
  get importedAt() { return this.props.importedAt }

  get totalAmount(): Money {
    return Money.of(this.props.amount.value * this.props.quantity)
  }
}
