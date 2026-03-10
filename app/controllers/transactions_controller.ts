import Transaction from '#models/transaction'

export default class TransactionsController {
  async index() {
    return await Transaction.query().preload('client').preload('gateway')
  }
}
