import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import jwt from 'jsonwebtoken'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)

    if (!user || user.password !== password) {
      return response.unauthorized({ message: 'invalid credentials' })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      'super-secret-key',
      { expiresIn: '1h' }
    )

    return { token }
  }
}
