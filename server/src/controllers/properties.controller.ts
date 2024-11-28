import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PROPERTY_REQUEST_BODY, PROPERTY_REQUEST_QUERY } from '~/models/requests/properties.request'
import propertiesService from '~/services/properties.service'
import { responseSuccess } from '~/utils/response'
const createProperty = async (req: Request<ParamsDictionary, any, PROPERTY_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body
  const result = await propertiesService.create(payload)
  return responseSuccess(res, {
    message: 'Tạo loại hình thành công',
    data: result
  })
}
const getProperties = async (req: Request<ParamsDictionary, any, any, PROPERTY_REQUEST_QUERY>, res: Response) => {
  const { name } = req.query
  const result = await propertiesService.getAll(name)
  return responseSuccess(res, {
    message: 'Lấy danh sách loại hình thành công',
    data: result
  })
}
const getPropertyByID = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { id } = req.params
  const result = await propertiesService.getOne(id)
  if (!result) {
    return responseSuccess(res, {
      message: 'Loại hình không tồn tại',
      data: null
    })
  }
  return responseSuccess(res, {
    message: 'Lấy loại hình thành công',
    data: result
  })
}
const editProperty = async (req: Request<ParamsDictionary, any, PROPERTY_REQUEST_BODY, any>, res: Response) => {
  const { id } = req.params
  const payload = req.body
  const result = await propertiesService.update(id, payload)
  return responseSuccess(res, {
    message: 'Cập nhật loại hình thành công',
    data: result
  })
}
const deleteOne = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { id } = req.params
  const result = await propertiesService.deleteOne(id)
  if (!result) {
    return responseSuccess(res, {
      message: 'Loại hình không tồn tại',
      data: null
    })
  }
  return responseSuccess(res, {
    message: 'Xóa loại hình thành công',
    data: result
  })
}
const deleteMany = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { ids } = req.body
  const result = await propertiesService.deleteMany(ids)
  return responseSuccess(res, {
    message: 'Xóa loại hình thành công',
    data: result
  })
}
const deleteAll = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await propertiesService.deleteAll()
  return responseSuccess(res, {
    message: 'Xóa tất cả loại hình thành công',
    data: result
  })
}
const propertiesControllers = {
  createProperty,
  getProperties,
  editProperty,
  deleteOne,
  deleteMany,
  getPropertyByID,
  deleteAll
}
export default propertiesControllers
