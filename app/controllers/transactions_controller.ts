import Transaction from '#models/transaction'
import { PaymentService } from '#services/payment_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {
  async index() {
    return await Transaction.query().preload('client').preload('gateway')
  }

  async store({ request }: HttpContext) {
    const data = request.only(['clientId', 'cardNumber', 'cvv', 'products'])

    const paymentService = new PaymentService()

    const transaction = await paymentService.processPayment(data)

    return transaction
  }

  async refund({ params }: HttpContext) {
    const paymentService = new PaymentService()

    const paramsId = await paymentService.refund(params.id)

    return paramsId
  }
}
