/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import TransactionsController from '#controllers/transactions_controller'
import AuthController from '#controllers/auth_controller'
import { middleware } from '#start/kernel'

router.get('/', () => {
  return { message: 'API running' }
})

router.post('/login', [AuthController, 'login'])

router.post('/transactions', '#controllers/transactions_controller.store')

router
  .group(() => {
    router.get('/clients', '#controllers/clients_controller.index')

    router.get('/products', '#controllers/products_controller.index')
    router.post('/products', '#controllers/products_controller.store')

    router.get('/gateways', '#controllers/gateways_controller.index')

    router.get('/transactions', '#controllers/transactions_controller.index')
    router.post('/transactions/:id/refund', [TransactionsController, 'refund'])
  })
  .use(middleware.auth())
