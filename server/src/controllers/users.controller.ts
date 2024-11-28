import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserProfile } from '~/models/requests/users.request'
import { USER_SCHEMA } from '~/models/schemas/User.schema'
import { VIP_PACKAGE_SCHEMA } from '~/models/schemas/VipPackage.schema'
import userService from '~/services/users.service'
import vipUserDetailsService from '~/services/vip_user_detail.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'
const getProfile = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.getUserById(user_id)
  return responseSuccess(res, {
    message: 'Lấy thông tin người dùng thành công',
    data: result
  })
}
const updateProfile = async (req: Request<ParamsDictionary, any, UserProfile, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.updateProfile(user_id, req.body)
  return responseSuccess(res, {
    message: 'Cập nhật thông tin người dùng thành công',
    data: result
  })
}
const lockPost = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const { post_id } = req.body
  const result = await userService.blockPost(user_id, post_id)
  return responseSuccess(res, {
    message: 'Chặn tin đăng thành công',
    data: result
  })
}
const unlockPost = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const { post_id } = req.params
  const result = await userService.unblockPost(user_id, post_id)
  return responseSuccess(res, {
    message: 'Bỏ chặn tin đăng thành công',
    data: result
  })
}
const getLockPosts = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.getLockPosts(user_id)
  return responseSuccess(res, {
    message: 'Lấy danh sách tin đăng bị chặn thành công',
    data: result
  })
}
const requestLockAccount = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.requestLockAccount(user_id)
  return responseSuccess(res, {
    message: 'Yêu cầu khóa tài khoản thành công',
    data: result
  })
}
const requestUnlockAccount = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.requestUnlockAccount(user_id)
  return responseSuccess(res, {
    message: 'Yêu cầu mở khóa tài khoản thành công',
    data: result
  })
}
const lockAccount = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.params
  console.log('user_id', req.params, user_id)
  if (!user_id)
    return responseSuccess(res, {
      message: 'Không tìm thấy user_id',
      data: null
    })
  const user = await userService.getUserById(user_id)
  if (!user) {
    return responseSuccess(res, {
      message: 'Không tìm thấy người dùng',
      data: null
    })
  }
  const result = await userService.lockAccount(user_id)
  return responseSuccess(res, {
    message: 'Khóa tài khoản thành công',
    data: result
  })
}
const unlockAccount = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.params
  console.log('user_id', req.params, user_id)
  if (!user_id)
    return responseSuccess(res, {
      message: 'Không tìm thấy user_id',
      data: null
    })
  const user = await userService.getUserById(user_id)
  if (!user) {
    return responseSuccess(res, {
      message: 'Không tìm thấy người dùng',
      data: null
    })
  }
  const result = await userService.unlockAccount(user_id)
  return responseSuccess(res, {
    message: 'Mở khóa tài khoản thành công',
    data: result
  })
}
const getAllUsers = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const user_vip = (await vipUserDetailsService.getUserVip()) as {
    _id: ObjectId
    current_active: boolean
    user: USER_SCHEMA
    package: VIP_PACKAGE_SCHEMA
    start_date: Date
    end_date: Date
  }[]
  // Chọn trong danh sách users loại trừ những user_vip trên
  const users = await userService.getAllUsers()
  const users_without_vip = users.filter(
    (user) => !user_vip.find((vip) => vip.user._id.toString() === user._id.toString())
  )
  return responseSuccess(res, {
    message: 'Lấy danh sách người dùng thành công',
    data: users_without_vip // Trả về danh sách người dùng không bao gồm user_vip
  })
}

const getUserById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { id } = req.params
  console.log('user_id', req.params, id)

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const result = await userService.getUserById(id)
    return responseSuccess(res, {
      message: 'Lấy thông tin người dùng thành công',
      data: result
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const usersControllers = {
  getProfile,
  updateProfile,
  lockPost,
  unlockPost,
  getLockPosts,
  requestLockAccount,
  requestUnlockAccount,
  lockAccount,
  unlockAccount,
  getAllUsers,
  getUserById
}
export default usersControllers
