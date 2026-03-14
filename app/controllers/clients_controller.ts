import Client from '#models/client'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index() {
    return await Client.all()
  }
}
