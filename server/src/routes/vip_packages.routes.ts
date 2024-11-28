import { Router } from 'express'
import vipPackagesControllers from '~/controllers/vip_packages.controller'
import commonMiddlewares from '~/middlewares/common.middleware'
import vipPackagesMiddlewares from '~/middlewares/vip_packages.middleware'

const vipPackagesRoutes = Router()

/**
 * description: Create a new vip package
 * method: POST
 * path: /vip-packages/create
 * body: VIP_PACKAGE_REQUEST_BODY
 * middleware: createVipPackageValidator
 */
vipPackagesRoutes.post(
  '/create',
  vipPackagesMiddlewares.createVipPackageValidator,
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  vipPackagesControllers.createVip
)
/**
 * description: Get all vip packages
 * method: GET
 * path: /vip-packages
 */
vipPackagesRoutes.get('/', vipPackagesControllers.getVips)

/**
 * description: Get active vip
 * method: GET
 */
vipPackagesRoutes.get('/active', vipPackagesControllers.getActiveVipPackages)
/**
 * description: Get inactive vip
 * method: GET
 */
vipPackagesRoutes.get('/inactive', vipPackagesControllers.getInactiveVipPackages)
/**
 * description: Get vip package by id
 * method: GET
 * path: /vip-packages/:id
 */
vipPackagesRoutes.get('/:id', vipPackagesControllers.getVipById)

/**
 * description: Update vip package by id
 * method: PUT
 * path: /vip-packages/:id
 * body: VIP_PACKAGE_REQUEST_BODY
 */
vipPackagesRoutes.put(
  '/:id',
  vipPackagesMiddlewares.createVipPackageValidator,
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  vipPackagesControllers.updateVip
)

/**
 * description: Delete all vip packages
 * method: DELETE
 * middleware: accessTokenValidator, isAdmin
 */
vipPackagesRoutes.delete(
  '/delete-all',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  vipPackagesControllers.deleteAllVips
)

/**
 * description: Delete vip package by id
 * method: DELETE
 * path: /vip-packages/:id
 * middleware: accessTokenValidator, isAdmin
 */
vipPackagesRoutes.delete(
  '/:id',
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  vipPackagesControllers.deleteVipById
)
export default vipPackagesRoutes
