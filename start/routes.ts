/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', () => {
  return { message: 'API running' }
})

router.get('/clients', '#controllers/clients_controller.index')
router.post('/clients', '#controllers/clients_controller.store')

router.get('/products', '#controllers/products_controller.index')
router.post('/products', '#controllers/products_controller.store')

router.get('/gateways', '#controllers/gateways_controller.index')

router.get('/transactions', '#controllers/transactions_controller.index')
router.post('/transactions', '#controllers/transactions_controller.store')
