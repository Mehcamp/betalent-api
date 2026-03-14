import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      name: 'Admin',
      email: 'admin@email.com',
      password: '123456',
      role: 'ADMIN',
    })
  }
}
