import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index() {
    return await Product.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['name', 'amount'])

    const product = await Product.create(data)

    return product
  }
}
