import { IUserRepository } from '@domain/repositories/IUserRepository'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  token: string
  userId: string
}

export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute({ email, password }: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepo.findByEmail(email)
    if (!user) throw new Error('Invalid credentials')

    const valid = await compare(password, user.passwordHash)
    if (!valid) throw new Error('Invalid credentials')

    const token = sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

    return { token, userId: user.id }
  }
}
