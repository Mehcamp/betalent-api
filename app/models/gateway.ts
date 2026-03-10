import { GatewaySchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from './transaction.ts'

export default class Gateway extends GatewaySchema {
  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}
