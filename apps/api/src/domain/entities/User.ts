import { Email } from '../value-objects/Email'

export interface UserProps {
  id: string
  email: Email
  passwordHash: string
  whatsapp?: string
  reportTime?: string
  reportActive: boolean
  createdAt: Date
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props)
  }

  get id() { return this.props.id }
  get email() { return this.props.email }
  get passwordHash() { return this.props.passwordHash }
  get whatsapp() { return this.props.whatsapp }
  get reportTime() { return this.props.reportTime }
  get reportActive() { return this.props.reportActive }
  get createdAt() { return this.props.createdAt }

  activateReport(time: string, whatsapp: string): User {
    return new User({ ...this.props, reportActive: true, reportTime: time, whatsapp })
  }

  deactivateReport(): User {
    return new User({ ...this.props, reportActive: false })
  }
}
