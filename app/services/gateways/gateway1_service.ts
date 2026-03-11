import axios from 'axios'

export default class Gateway1Service {
  async createTransaction(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }) {
    const response = await axios.post('http://localhost:3001/transactions', {
      amount: data.amount,
      name: data.name,
      email: data.email,
      cardNumber: data.cardNumber,
      cvv: data.cvv,
    })

    return response
  }
}
