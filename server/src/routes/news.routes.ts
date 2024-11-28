import { Router } from 'express'
import newsControllers from '~/controllers/news.controller'
import commonMiddlewares from '~/middlewares/common.middleware'
import newsMiddlewares from '~/middlewares/news.middleware'
import { wrapRequestHandler } from '~/utils/requestHandler'

const newsRoutes = Router()

/**
 * description: Create a news
 * method: POST
 * path: /news/create
 * body: NEWS_REQUEST_BODY
 */
newsRoutes.post(
  '/create',
  newsMiddlewares.createNewsValidator,
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(newsControllers.createNews)
)
/**
 * description: Get all news
 */
newsRoutes.get('/', wrapRequestHandler(newsControllers.getNews))

/**
 * description: Get a news by id
 * path: /news/:id
 * params: id
 */
newsRoutes.get('/:id', wrapRequestHandler(newsControllers.getNewsById))
/**
 * description: Update a news by id
 * method: PUT
 */
newsRoutes.put(
  '/:id',
  newsMiddlewares.createNewsValidator,
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(newsControllers.updateNewsById)
)
/**
 * description: Delete many news
 * method: DELETE
 */
newsRoutes.delete(
  '/delete-many',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(newsControllers.deleteManyNews)
)
/**
 * description: Delete all news
 * method: DELETE
 */
newsRoutes.delete(
  '/delete-all',
  commonMiddlewares.accessTokenValidator,

  commonMiddlewares.isAdmin,
  wrapRequestHandler(newsControllers.deleteAllNews)
)
/**
 * description: Delete a news by id
 * method: DELETE
 */
newsRoutes.delete(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(newsControllers.deleteNewsById)
)
export default newsRoutes
