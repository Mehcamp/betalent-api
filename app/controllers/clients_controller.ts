import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index() {
    return await Client.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name', 'email'])

    const client = await Client.create(data)

    return client
  }
}
