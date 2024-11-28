import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { NEWS_REQUEST_BODY } from '~/models/requests/news.request'
import newsService from '~/services/news.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'

const createNews = async (req: Request<ParamsDictionary, any, NEWS_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await newsService.createNews(payload, user_id)
  return responseSuccess(res, {
    message: 'Tạo tin tức thành công',
    data: result
  })
}
const getNews = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await newsService.getNews()
  return responseSuccess(res, {
    message: 'Lấy danh sách tin tức thành công',
    data: result
  })
}

const getNewsById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { id } = req.params
  const result = await newsService.getNewsById(id)
  return responseSuccess(res, {
    message: 'Lấy tin tức thành công',
    data: result
  })
}

const updateNewsById = async (req: Request<ParamsDictionary, any, NEWS_REQUEST_BODY, any>, res: Response) => {
  const { id } = req.params
  const payload = req.body
  const result = await newsService.updateNewsById(id, payload)
  return responseSuccess(res, {
    message: 'Cập nhật tin tức thành công',
    data: result
  })
}
const deleteNewsById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { id } = req.params
  const result = await newsService.deleteNewsById(id)
  return responseSuccess(res, {
    message: 'Xóa tin tức thành công',
    data: result
  })
}

const deleteManyNews = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const ids = req.body.ids
  const result = await newsService.deleteManyNews(ids)
  return responseSuccess(res, {
    message: 'Xóa nhiều tin tức thành công',
    data: result
  })
}
const deleteAllNews = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await newsService.deleteAllNews()
  return responseSuccess(res, {
    message: 'Xóa tất cả tin tức thành công',
    data: result
  })
}
const newsControllers = {
  createNews,
  getNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
  deleteManyNews,
  deleteAllNews
}
export default newsControllers
