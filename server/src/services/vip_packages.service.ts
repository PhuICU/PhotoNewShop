import { VIP_PACKAGE_REQUEST_BODY } from '~/models/requests/vip_packages.request'
import databaseService from './database.service'
import { VIP_PACKAGE_SCHEMA } from '~/models/schemas/VipPackage.schema'
import { ObjectId } from 'mongodb'
import { VIP_PACKAGE_STATUS } from '~/enums/util.enum'

class VipPackagesService {
  public async create(payload: VIP_PACKAGE_REQUEST_BODY) {
    if (payload.discount) {
      return await databaseService.vip_packages.insertOne(
        new VIP_PACKAGE_SCHEMA({
          ...payload,
          discount: {
            ...payload.discount,
            startDate: new Date(payload.discount.startDate),
            endDate: new Date(payload.discount.endDate)
          }
        })
      )
    } else {
      return await databaseService.vip_packages.insertOne(
        new VIP_PACKAGE_SCHEMA({
          ...payload,
          discount: undefined
        })
      )
    }
  }
  public async getAll() {
    return await databaseService.vip_packages.find().toArray()
  }
  public async getById(id: string) {
    return await databaseService.vip_packages.findOne({ _id: new ObjectId(id) })
  }
  public async update(id: string, payload: VIP_PACKAGE_REQUEST_BODY) {
    if (payload.discount) {
      return await databaseService.vip_packages.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...payload,
            updated_at: new Date(),
            discount: {
              ...payload.discount,
              startDate: new Date(payload.discount.startDate),
              endDate: new Date(payload.discount.endDate)
            }
          }
        }
      )
    }
  }
  public async delete(id: string) {
    return await databaseService.vip_packages.findOneAndDelete({ _id: new ObjectId(id) })
  }
  public async getActiveVipPackages() {
    return await databaseService.vip_packages.find({ status: VIP_PACKAGE_STATUS.ACTIVE }).toArray()
  }
  public async getInactiveVipPackages() {
    return await databaseService.vip_packages.find({ status: VIP_PACKAGE_STATUS.INACTIVE }).toArray()
  }
  public async deleteAll() {
    return await databaseService.vip_packages.deleteMany({})
  }
}
const vipPackagesService = new VipPackagesService()
export default vipPackagesService
