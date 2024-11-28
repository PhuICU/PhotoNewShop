import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { VIP_PACKAGE_REQUEST_BODY } from '~/models/requests/vip_packages.request'
import vipPackagesService from '~/services/vip_packages.service'
import { responseSuccess } from '~/utils/response'
const createVip = async (req: Request<ParamsDictionary, any, VIP_PACKAGE_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body
  const result = await vipPackagesService.create(payload)
  return responseSuccess(res, {
    message: 'Tạo gói vip thành công',
    data: result
  })
}
const getVips = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await vipPackagesService.getAll()
  return responseSuccess(res, {
    message: 'Lấy danh sách gói vip thành công',
    data: result
  })
}
const getVipById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const id = req.params.id
  const result = await vipPackagesService.getById(id)
  return responseSuccess(res, {
    message: 'Lấy gói vip thành công',
    data: result
  })
}
const updateVip = async (req: Request<ParamsDictionary, any, VIP_PACKAGE_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body
  const id = req.params.id
  const result = await vipPackagesService.update(id, payload)
  return responseSuccess(res, {
    message: 'Cập nhật gói vip thành công',
    data: result
  })
}
const deleteVipById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const id = req.params.id
  const result = await vipPackagesService.delete(id)
  return responseSuccess(res, {
    message: 'Xóa gói vip thành công',
    data: result
  })
}
const deleteAllVips = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await vipPackagesService.deleteAll()
  return responseSuccess(res, {
    message: 'Xóa tất cả gói vip thành công',
    data: result
  })
}
const getActiveVipPackages = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await vipPackagesService.getActiveVipPackages()
  return responseSuccess(res, {
    message: 'Lấy danh sách gói vip active thành công',
    data: result
  })
}
const getInactiveVipPackages = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await vipPackagesService.getInactiveVipPackages()
  return responseSuccess(res, {
    message: 'Lấy danh sách gói vip inactive thành công',
    data: result
  })
}
const vipPackagesControllers = {
  createVip,
  getVips,
  getVipById,
  updateVip,
  deleteVipById,
  deleteAllVips,
  getActiveVipPackages,
  getInactiveVipPackages
}
export default vipPackagesControllers
