import Gateway from '#models/gateway'

export default class GatewaysController {
  async index() {
    return await Gateway.query().where('is_active', true).orderBy('priority')
  }
}
