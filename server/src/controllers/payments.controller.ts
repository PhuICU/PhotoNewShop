import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import httpStatusCode from '~/constants/httpStatusCode'
import { PAYMENT_STATUS, VIP_PACKAGE_DURATION, VIP_STATUS } from '~/enums/util.enum'
import { PAYMENT_REQUEST_BODY } from '~/models/requests/payments.request'
import { VIP_USER_DETAIL_REQUEST_BODY } from '~/models/requests/vip_user_detail.request'
import { PAYMENT_SCHEMA } from '~/models/schemas/Payment.schema'
import { USER_SCHEMA } from '~/models/schemas/User.schema'
import { VIP_PACKAGE_SCHEMA } from '~/models/schemas/VipPackage.schema'
import { VIP_USER_DETAIL_SCHEMA } from '~/models/schemas/VipUserDetail.schema'
import paymentService from '~/services/payments.service'
import userService from '~/services/users.service'
import vipPackagesService from '~/services/vip_packages.service'
import vipUserDetailsService from '~/services/vip_user_detail.service'
import { TokenPayload } from '~/type'
import { sendEmailSignVipSuccess } from '~/utils/email'
import { ErrorWithMessage } from '~/utils/error'
import { responseSuccess } from '~/utils/response'

const createPayment = async (req: Request<ParamsDictionary, any, PAYMENT_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body
  const { user_id } = req.decoded_access_token as TokenPayload
  const package_id = payload.package_id
  const package_vip = await vipPackagesService.getById(package_id)
  if (!package_vip) {
    throw new ErrorWithMessage({
      message: 'Gói vip không tồn tại',
      status: httpStatusCode.BAD_REQUEST
    })
  }
  const { is_paid } = req.body
  const result = await paymentService.createPayment(payload, user_id)
  if (is_paid) {
    const user = (await userService.getUserById(user_id)) as USER_SCHEMA
    const currentVip = (await vipUserDetailsService.getActiveCurrentVip(user_id)) as {
      _id: string
      package: VIP_PACKAGE_SCHEMA
      user: USER_SCHEMA
      start_date: Date
      posting_used: number | string
      comments_used: number | string
      featured_post_used: number | string
      status: VIP_STATUS
      end_date: Date
      current_active: boolean
    }[]
    console.log(currentVip)
    const payment = (await paymentService.confirmPayment(result.insertedId.toString())) as PAYMENT_SCHEMA
    if (currentVip.length === 0) {
      const endDate: Date = new Date()
      if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_DAY) {
        endDate.setDate(endDate.getDate() + 1)
      } else if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_WEEK) {
        endDate.setDate(endDate.getDate() + 7)
      } else if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_MONTH) {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_YEAR) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }
      const details_payload: VIP_USER_DETAIL_REQUEST_BODY = {
        user_id: user._id.toString(),
        package_id: package_id,
        start_date: new Date(),
        end_date: endDate
      }
      const createVipDetail = await vipUserDetailsService.create(details_payload)
      const vip_user_detail = (await vipUserDetailsService.getById(
        createVipDetail.insertedId.toString()
      )) as VIP_USER_DETAIL_SCHEMA
      await paymentService.confirmPayment(result.insertedId.toString())
      await sendEmailSignVipSuccess({
        user,
        payment,
        vip_package: package_vip,
        vip_detail: vip_user_detail,
        subject: 'Đăng ký gói vip thành công'
      })
    } else {
      const endDate: Date = new Date(currentVip[0]?.end_date)
      if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_DAY) {
        endDate.setDate(endDate.getDate() + 1)
      } else if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_WEEK) {
        endDate.setDate(endDate.getDate() + 7)
      } else if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_MONTH) {
        endDate.setMonth(endDate.getMonth() + 1)
      } else if (package_vip.duration === VIP_PACKAGE_DURATION.ONE_YEAR) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      }
      const details_payload: VIP_USER_DETAIL_REQUEST_BODY = {
        user_id: user._id.toString(),
        package_id: package_id,
        start_date: currentVip[0].end_date,
        status: VIP_STATUS.RENEW,
        end_date: endDate
      }
      const deleteVipCurrent = await vipUserDetailsService.deleteVipUserDetail(currentVip[0]._id.toString())
      const createVipDetail = await vipUserDetailsService.create(details_payload)
      const vip_user_detail = (await vipUserDetailsService.getById(
        createVipDetail.insertedId.toString()
      )) as VIP_USER_DETAIL_SCHEMA
      await paymentService.confirmPayment(result.insertedId.toString())
      await sendEmailSignVipSuccess({
        user,
        payment,
        vip_package: package_vip,
        vip_detail: vip_user_detail,
        subject: 'Gia hạn gói vip thành công'
      })
    }
  }
  return responseSuccess(res, {
    message: 'Tạo thanh toán thành công',
    data: result
  })
}
// xác nhận thanh toán
const confirmPayment = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const id = req.params.id
  const payment = (await paymentService.getPaymentById(id)) as PAYMENT_SCHEMA
  if (payment && payment.status === PAYMENT_STATUS.SUCCESS) {
    return responseSuccess(res, {
      message: 'Thanh toán đã được xác nhận',
      data: payment
    })
  }
  const result = await paymentService.confirmPayment(id)
  if (!result)
    throw new ErrorWithMessage({ message: 'Xác nhận thanh toán thất bại', status: httpStatusCode.BAD_REQUEST })
  const vip_package = (await vipPackagesService.getById(result.package_id.toString())) as VIP_PACKAGE_SCHEMA
  const user = (await userService.getUserById(result.user_id.toString())) as USER_SCHEMA
  // handle end date from vip_package privileges
  const endDate: Date = new Date()
  if (vip_package.duration === VIP_PACKAGE_DURATION.ONE_DAY) {
    endDate.setDate(endDate.getDate() + 1)
  } else if (vip_package.duration === VIP_PACKAGE_DURATION.ONE_WEEK) {
    endDate.setDate(endDate.getDate() + 7)
  } else if (vip_package.duration === VIP_PACKAGE_DURATION.ONE_MONTH) {
    endDate.setMonth(endDate.getMonth() + 1)
  } else if (vip_package.duration === VIP_PACKAGE_DURATION.ONE_YEAR) {
    endDate.setFullYear(endDate.getFullYear() + 1)
  }
  const details_payload: VIP_USER_DETAIL_REQUEST_BODY = {
    user_id: result.user_id.toString(),
    package_id: result.package_id.toString(),
    start_date: new Date(),
    end_date: endDate
  }
  const createVipDetail = await vipUserDetailsService.create(details_payload)
  const vip_user_detail = (await vipUserDetailsService.getById(
    createVipDetail.insertedId.toString()
  )) as VIP_USER_DETAIL_SCHEMA
  await sendEmailSignVipSuccess({
    user,
    payment,
    vip_package,
    vip_detail: vip_user_detail,
    subject: 'Đăng ký gói vip thành công'
  })
  return responseSuccess(res, {
    message: 'Xác nhận thanh toán thành công',
    data: result
  })
}
const getAllPayments = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const result = await paymentService.getAllPayments()
  return responseSuccess(res, {
    message: 'Lấy danh sách thanh toán thành công',
    data: result
  })
}
const getById = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const id = req.params.id
  const result = await paymentService.getPaymentById(id)
  return responseSuccess(res, {
    message: 'Lấy thanh toán thành công',
    data: result
  })
}
const getPaymentByUserId = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await paymentService.getPaymentsByUserId(user_id)
  return responseSuccess(res, {
    message: 'Lấy thanh toán của người dùng thành công',
    data: result
  })
}
const updatePayment = async (req: Request<ParamsDictionary, any, PAYMENT_REQUEST_BODY, any>, res: Response) => {
  const id = req.params.id
  const payload = req.body
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await paymentService.updatePayment(id, payload, user_id)
  return responseSuccess(res, {
    message: 'Cập nhật thanh toán thành công',
    data: result
  })
}
const deletePaymentId = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const id = req.params.id
  const result = await paymentService.deletePayment(id)
  return responseSuccess(res, {
    message: 'Xóa thanh toán thành công',
    data: result
  })
}
const paymentsControllers = {
  createPayment,
  confirmPayment,
  getAllPayments,
  getById,
  getPaymentByUserId,
  updatePayment,
  deletePaymentId
}
export default paymentsControllers
