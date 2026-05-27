import { PrismaClient } from '@prisma/client'
import { IUserRepository } from '@domain/repositories/IUserRepository'
import { User } from '@domain/entities/User'
import { Email } from '@domain/value-objects/Email'

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } })
    return row ? this.toDomain(row) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { email } })
    return row ? this.toDomain(row) : null
  }

  async save(user: User): Promise<User> {
    const row = await this.prisma.user.create({ data: this.toPrisma(user) })
    return this.toDomain(row)
  }

  async update(user: User): Promise<User> {
    const row = await this.prisma.user.update({
      where: { id: user.id },
      data: this.toPrisma(user),
    })
    return this.toDomain(row)
  }

  private toDomain(row: any): User {
    return User.create({
      id: row.id,
      email: Email.create(row.email),
      passwordHash: row.password,
      whatsapp: row.whatsapp ?? undefined,
      reportTime: row.reportTime ?? undefined,
      reportActive: row.reportActive,
      createdAt: row.createdAt,
    })
  }

  private toPrisma(user: User) {
    return {
      id: user.id,
      email: user.email.value,
      password: user.passwordHash,
      whatsapp: user.whatsapp ?? null,
      reportTime: user.reportTime ?? null,
      reportActive: user.reportActive,
    }
  }
}
