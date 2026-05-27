export class Money {
  private constructor(private readonly _value: number) {}

  static of(value: number): Money {
    if (value < 0) throw new Error('Money value cannot be negative')
    return new Money(Math.round(value * 100) / 100)
  }

  static zero(): Money { return new Money(0) }

  get value() { return this._value }

  add(other: Money): Money { return Money.of(this._value + other._value) }
  subtract(other: Money): Money { return Money.of(this._value - other._value) }

  format(): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this._value)
  }

  toString() { return this._value.toFixed(2) }
}
