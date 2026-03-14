import Gateway1Service from './gateways/gateway1_service.js'
import Gateway2Service from './gateways/gateway2_service.js'

import Client from '#models/client'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Gateway from '#models/gateway'
import axios from 'axios'

export class PaymentService {
  async processPayment(data: {
    clientId: number
    cardNumber: string
    cvv: string
    products: { id: number; quantity: number }[]
  }) {
    const client = await Client.findOrFail(data.clientId)

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

        console.log('Gateway usado:', gateway.name)
        console.log('Gateway data:', response?.data)
        console.log('Gateway id:', response?.data.id)

        const transaction = await Transaction.create({
          clientId: client.id,
          gatewayId: gateway.id,
          amount: amount,
          status: 'success',
          externalId: response?.data.id,
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

  async refund(transactionId: number) {
    const transaction = await Transaction.findOrFail(transactionId)

    const gateway = await Gateway.findOrFail(transaction.gatewayId)

    if (gateway.name === 'Gateway 1') {
      await axios.post('http://localhost:3001/charge_back', {
        id: transaction.externalId,
      })

      transaction.status = 'refunded'
      await transaction.save()

      return {
        transactionId: transaction.id,
        status: 'refunded',
      }
    }

    if (gateway.name === 'Gateway 2') {
      await axios.post('http://localhost:3002/transacoes/reembolso', {
        id: transaction.externalId,
      })

      transaction.status = 'refunded'
      await transaction.save()

      return {
        transactionId: transaction.id,
        status: 'refunded',
      }
    }

    throw new Error('Gateway not supported')
  }
}
