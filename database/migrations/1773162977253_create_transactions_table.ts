import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('client_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')

      table
        .integer('gateway_id')
        .unsigned()
        .index()
        .references('id')
        .inTable('gateways')

      table.string('external_id')
      table.string('status')

      table.integer('amount')

      table.string('card_last_numbers')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
