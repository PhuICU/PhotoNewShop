import { Router } from 'express'
import paymentsControllers from '~/controllers/payments.controller'
import commonMiddlewares from '~/middlewares/common.middleware'
import paymentsMiddlewares from '~/middlewares/payment.middleware'

const paymentsRoutes = Router()

/**
 * description: Create a new payment
 * method: POST
 * path: /payments/create
 * body: PAYMENT_REQUEST_BODY
 */
paymentsRoutes.post(
  '/create',
  paymentsMiddlewares.createPaymentValidator,
  commonMiddlewares.accessTokenValidator,
  paymentsControllers.createPayment
)

/**
 * description: Get all payments
 * method: GET
 */
paymentsRoutes.get(
  '/',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  paymentsControllers.getAllPayments
)
/**
 * description: Get payment by id
 * method: GET
 * path: /payments/:id
 */
paymentsRoutes.get(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  paymentsControllers.getById
)

/**
 * description: Confirm payment
 * method: PUT
 * path: /payments/confirm/:id
 * middleware: confirmPaymentValidator
 */
paymentsRoutes.put(
  '/confirm/:id',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  paymentsControllers.confirmPayment
)
/**
 * description: Update payment by id
 * method: PUT
 * path: /payments/:id
 */
paymentsRoutes.put(
  '/:id',
  paymentsMiddlewares.createPaymentValidator,
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  paymentsControllers.updatePayment
)
/**
 * description: Delete all payments
 * method: DELETE
 * middleware: accessTokenValidator, isAdmin
 */
paymentsRoutes.delete(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  paymentsControllers.deletePaymentId
)
export default paymentsRoutes
