import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import vipUserDetailsService from '~/services/vip_user_detail.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'

const createDetail = async (req: Request, res: Response) => {}
const getDetailsByUserId = async (req: Request<ParamsDictionary>, res: Response) => {
  const id = req.params.id
  const result = await vipUserDetailsService.getById(id)
}
const getAllUserVipDetails = async (req: Request, res: Response) => {
  const result = await vipUserDetailsService.getUserVip()
  return responseSuccess(res, {
    message: 'Get all user vip details successfully',
    data: result
  })
}
const getVipUserHistoryByUserId = async (req: Request<ParamsDictionary>, res: Response) => {
  const id = req.params.id
  const result = await vipUserDetailsService.getVipUserHistoryByUserId(id)
  return responseSuccess(res, {
    message: 'Get vip user history successfully',
    data: result
  })
}
const getUserVipHistory = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await vipUserDetailsService.getHistory(user_id)
  return responseSuccess(res, {
    message: 'Get user vip hist successfully',
    data: result
  })
}
const getAllVipUserDetails = async (req: Request, res: Response) => {
  const result = await vipUserDetailsService.getAllVipUserDetails()
  return responseSuccess(res, {
    message: 'Get all vip user details successfully',
    data: result
  })
}
const getActiveCurrentVip = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await vipUserDetailsService.getActiveCurrentVip(user_id)
  return responseSuccess(res, {
    message: 'Get active current vip successfully',
    data: result[0]
  })
}
const vipUserDetailsControllers = {
  createDetail,
  getDetailsByUserId,
  getAllUserVipDetails,
  getVipUserHistoryByUserId,
  getUserVipHistory,
  getAllVipUserDetails,
  getActiveCurrentVip
}
export default vipUserDetailsControllers
