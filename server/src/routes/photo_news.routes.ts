import { Router } from 'express'
import photoNewsControllers from '~/controllers/photo_news.controller'
import commonMiddlewares from '~/middlewares/common.middleware'
import photoNewsMiddlewares from '~/middlewares/photo_news.middleware'
import { wrapRequestHandler } from '~/utils/requestHandler'

const photoNewsRoutes = Router()

/**
 * description: Create a new real estate news
 * method: POST
 * path: /real-estate-news/create
 * body: REAL_ESTATE_NEW_REQUEST_BODY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
photoNewsRoutes.post(
  '/create',
  commonMiddlewares.accessTokenValidator,
  photoNewsMiddlewares.createValidator,
  wrapRequestHandler(photoNewsControllers.createPhotoNew)
)
/**
 * description: Get all real estate news
 * method: GET
 * path: /real-estate-news
 * query: REAL_ESTATE_NEW_QUERY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
photoNewsRoutes.get('/', wrapRequestHandler(photoNewsControllers.getPhotoNews))
/**
 * description: Get all real estate news by status
 * method: GET
 * path: /real-estate-news/status/:status
 */
photoNewsRoutes.get(
  '/status/:status',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(photoNewsControllers.getPhotoNewsByStatus)
)
/**
 * description: Get all post for admin
 * method: GET
 * path: /real-estate-news/admin/all
 */
photoNewsRoutes.get(
  '/admin/all',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(photoNewsControllers.getAllPosts)
)

/**
 * description: Get real estate news by id
 * method: GET
 * path: /real-estate-news/:id
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
photoNewsRoutes.get('/:id', wrapRequestHandler(photoNewsControllers.getPhotoNewsById))
/**
 * description: Get all post by user id
 * method: GET
 * path: /real-estate-news/user/:user_id
 * headers: {
 * Authorization: {
 *  description: Bearer access_token
 * }
 *  }
 */
photoNewsRoutes.get(
  '/user/:user_id',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(photoNewsControllers.getPhotoNewsByUserId)
)
/**
 * description: Update a real estate news
 * method: PUT
 * path: /real-estate-news/:id
 * body: REAL_ESTATE_NEW_REQUEST_BODY
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
/**
 * description: Approve a real estate news by id
 * method: PUT
 * path: /real-estate-news/update-status/:id
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 * body: {
 * status: string}
 */
photoNewsRoutes.put(
  '/update-status/:id',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(photoNewsControllers.updatePostStatus)
)
photoNewsRoutes.put(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  photoNewsMiddlewares.createValidator,
  wrapRequestHandler(photoNewsControllers.updatePhotoNew)
)

/**
 * description: Delete all real estate news
 * method: DELETE
 * path: /real-estate-news/delete-all
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
photoNewsRoutes.delete(
  '/delete-all',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(photoNewsControllers.deleteAllPhotoNews)
)
/**
 * description: Delete many real estate news
 * method: DELETE
 * path: /real-estate-news/delete-many
 * body: {
 * ids: [string]
 * }
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 * }
 */
photoNewsRoutes.delete(
  '/delete-many',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(photoNewsControllers.deleteManyPhotoNews)
)
/**
 * description: Delete a real estate news
 * method: DELETE
 * path: /real-estate-news/:id
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 */
photoNewsRoutes.delete(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(photoNewsControllers.deletePhotoNew)
)

export default photoNewsRoutes
