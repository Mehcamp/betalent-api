import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const authHeader = request.header('authorization')

    if (!authHeader) {
      return response.unauthorized({ message: 'Token not provided' })
    }

    const token = authHeader.replace('Bearer ', '')

    try {
      jwt.verify(token, 'super-secret-key')

      await next()
    } catch {
      return response.unauthorized({ message: 'Invalid token' })
    }
  }
}
