import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'


/**
 * @class AuthService used authenticate or verify
 */
export default class AuthService {
  async isCorrectPassword(candidatePassword: string, userPassword: string) {
    return bcrypt.compare(candidatePassword, userPassword)
  }

  signToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
  }

  async verifyAccessToken(token: string){
       // 2) Verification token
    return (promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET as string
      )) as unknown as { id: string }
  }

  createAccessToken(user: any) {
    const token = this.signToken(user.id)

    // Remove password from output
    user.password = undefined

    return {
      status: 'success',
      token,
      user,
    }
  }
}
