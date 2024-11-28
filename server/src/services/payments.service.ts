import { PAYMENT_REQUEST_BODY } from '~/models/requests/payments.request'
import databaseService from './database.service'
import { PAYMENT_SCHEMA } from '~/models/schemas/Payment.schema'
import { ObjectId } from 'mongodb'
import { PAYMENT_STATUS } from '~/enums/util.enum'

class PaymentService {
  async createPayment(payload: PAYMENT_REQUEST_BODY, user_id: string) {
    return await databaseService.payments.insertOne(
      new PAYMENT_SCHEMA({
        ...payload,
        payment_date: new Date(payload.payment_date),
        user_id: new ObjectId(user_id),
        package_id: new ObjectId(payload.package_id)
      })
    )
  }
  async getAllPayments() {
    return await databaseService.payments
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'vip_packages',
            localField: 'package_id',
            foreignField: '_id',
            as: 'package'
          }
        },
        {
          $project: {
            _id: 1,
            payment_date: 1,
            payment_method: 1,
            is_paid: 1,
            status: 1,
            amount: 1,
            currency: 1,
            user: {
              $arrayElemAt: ['$user', 0]
            },
            package: {
              $arrayElemAt: ['$package', 0]
            }
          }
        }
      ])
      .toArray()
  }
  async getPaymentById(id: string) {
    return await databaseService.payments.findOne({ _id: new ObjectId(id) })
  }
  async updatePayment(id: string, payload: PAYMENT_REQUEST_BODY, user_id: string) {
    return await databaseService.payments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          user_id: new ObjectId(user_id),
          payment_date: new Date(payload.payment_date),
          package_id: new ObjectId(payload.package_id)
        }
      },
      { returnDocument: 'after' }
    )
  }
  async deletePayment(id: string) {
    return await databaseService.payments.findOneAndDelete({ _id: new ObjectId(id) })
  }
  async getPaymentsByUserId(id: string) {
    return await databaseService.payments.find({ user_id: new ObjectId(id) }).toArray()
  }
  async deleteAllPayments() {
    return await databaseService.payments.deleteMany({})
  }
  async getPaidPayments() {
    return await databaseService.payments.find({ is_paid: true }).toArray()
  }
  async getUnpaidPayments() {
    return await databaseService.payments.find({ is_paid: false }).toArray()
  }
  async confirmPayment(id: string) {
    return await databaseService.payments.findOneAndUpdate(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          is_paid: true,
          status: PAYMENT_STATUS.SUCCESS
        }
      },
      {
        returnDocument: 'after'
      }
    )
  }
}
const paymentService = new PaymentService()
export default paymentService
