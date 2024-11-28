import { Router } from 'express'
import vipUserDetailsControllers from '~/controllers/vip_user_detail_controller'
import commonMiddlewares from '~/middlewares/common.middleware'
import { wrapRequestHandler } from '~/utils/requestHandler'

const vipUserDetailsRoutes = Router()

/**
 * description: Get vip user details by user id
 *
 */
vipUserDetailsRoutes.get(
  '/',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(vipUserDetailsControllers.getAllUserVipDetails)
)
/**
 * description: Get current vip user by user id
 * path: /vip-user-details/current
 * headers: {
 * Authorization: {
 * description: Bearer access_token
 * }
 */
vipUserDetailsRoutes.get(
  '/current-active',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(vipUserDetailsControllers.getActiveCurrentVip)
)

vipUserDetailsRoutes.get(
  '/history',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(vipUserDetailsControllers.getUserVipHistory)
)
/**
 * description: Get all vip user details
 * path: /user-vips/all
 */
vipUserDetailsRoutes.get(
  '/all-details',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(vipUserDetailsControllers.getAllVipUserDetails)
)
/**
 * description: Get vip user detail by id
 * path: /vip-user-details/:id
 */

/**
 * description: Get vip-user-detail by id
 * path: /vip-user-details/:id
 */
vipUserDetailsRoutes.get(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(vipUserDetailsControllers.getVipUserHistoryByUserId)
)

export default vipUserDetailsRoutes
