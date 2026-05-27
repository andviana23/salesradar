import { IUserRepository } from '@domain/repositories/IUserRepository'
import { User } from '@domain/entities/User'
import { Email } from '@domain/value-objects/Email'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'

export interface RegisterInput {
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute({ email, password }: RegisterInput): Promise<void> {
    const existing = await this.userRepo.findByEmail(email)
    if (existing) throw new Error('Email already registered')

    const passwordHash = await hash(password, 12)

    const user = User.create({
      id: randomUUID(),
      email: Email.create(email),
      passwordHash,
      reportActive: false,
      createdAt: new Date(),
    })

    await this.userRepo.save(user)
  }
}
