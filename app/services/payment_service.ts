import Gateway1Service from './gateways/gateway1_service.js'
import Gateway2Service from './gateways/gateway2_service.js'

import Client from '#models/client'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Gateway from '#models/gateway'

export class PaymentService {
  async processPayment(data: {
    clientId: number
    cardNumber: string
    cvv: string
    products: { id: number; quantity: number }[]
  }) {
    const client = await Client.findOrFail(data.clientId)

    // calcular valor total
    let amount = 0
    const productList: { product: Product; quantity: number }[] = []

    for (const item of data.products) {
      const product = await Product.findOrFail(item.id)

      amount += product.amount * item.quantity

      productList.push({
        product,
        quantity: item.quantity,
      })
    }

    const gateways = await Gateway.query().where('is_active', true).orderBy('priority')

    let lastError = null

    for (const gateway of gateways) {
      try {
        let response

        if (gateway.name === 'Gateway 1') {
          const gateway1 = new Gateway1Service()

          response = await gateway1.createTransaction({
            amount,
            name: client.name,
            email: client.email,
            cardNumber: data.cardNumber,
            cvv: data.cvv,
          })
        }

        if (gateway.name === 'Gateway 2') {
          const gateway2 = new Gateway2Service()

          response = await gateway2.createTransaction({
            amount,
            name: client.name,
            email: client.email,
            cardNumber: data.cardNumber,
            cvv: data.cvv,
          })
        }

        const lastNumbers = data.cardNumber.slice(-4)

        const transaction = await Transaction.create({
          clientId: client.id,
          gatewayId: gateway.id,
          amount: amount,
          status: 'success',
          externalId: response?.id ?? null,
          cardLastNumbers: lastNumbers,
        })

        for (const item of productList) {
          await TransactionProduct.create({
            transactionId: transaction.id,
            productId: item.product.id,
            quantity: item.quantity,
          })
        }

        return transaction
      } catch (error) {
        console.log(`Gateway ${gateway.name} failed`)
        lastError = error
      }
    }

    throw new Error('All gateways failed')
  }
}
