import { VIP_USER_DETAIL_REQUEST_BODY } from '~/models/requests/vip_user_detail.request'
import databaseService from './database.service'
import { VIP_USER_DETAIL_SCHEMA } from '~/models/schemas/VipUserDetail.schema'
import { ObjectId } from 'mongodb'
import { VIP_STATUS } from '~/enums/util.enum'

class VipUserDetailsService {
  async create(payload: VIP_USER_DETAIL_REQUEST_BODY) {
    return await databaseService.vip_user_details.insertOne(
      new VIP_USER_DETAIL_SCHEMA({
        ...payload,
        package_id: new ObjectId(payload.package_id),
        user_id: new ObjectId(payload.user_id)
      })
    )
  }
  public async getAll() {
    return await databaseService.vip_user_details.find().toArray()
  }
  public async getById(id: string) {
    return await databaseService.vip_user_details.findOne({ _id: new ObjectId(id), current_active: true })
  }
  public async update(id: string, payload: VIP_USER_DETAIL_REQUEST_BODY) {
    return await databaseService.vip_user_details.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          user_id: new ObjectId(payload.user_id),
          package_id: new ObjectId(payload.package_id)
        }
      },
      { returnDocument: 'after' }
    )
  }
  public async getUserVip() {
    // tìm tất cả user có current_active = true , và join với bảng user để lấy thông tin user,
    // join với bảng package để lấy thông tin package
    // sắp xếp theo ngày hết hạn giảm dần
    //trả về thông tin user, thông tin package, ngày hết hạn, ngày bắt đầu, trạng thái,
    return await databaseService.vip_user_details
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
          $match: {
            current_active: true
          }
        },
        {
          $sort: {
            end_date: -1
          }
        },
        // trả về object mới
        {
          $project: {
            user: {
              $arrayElemAt: ['$user', 0]
            },
            package: {
              $arrayElemAt: ['$package', 0]
            },
            start_date: 1,
            end_date: 1,
            current_active: 1
          }
        }
      ])
      .toArray()
  }
  public async getUserExcludeVip() {
    return databaseService.vip_user_details.find
  }
  public async getVipUserByUserId(userId: string) {
    return await databaseService.vip_user_details.findOne({ user_id: new ObjectId(userId), current_active: true })
  }
  public async getCurrentVip(userId: string) {
    return databaseService.vip_user_details
      .aggregate([
        {
          $lookup: {
            from: 'vip_packages',
            localField: 'package_id',
            foreignField: '_id',
            as: 'package'
          }
        },
        // lookup user
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            user_id: new ObjectId(userId)
          }
        },
        {
          $project: {
            user: {
              $arrayElemAt: ['$user', 0]
            },
            package: {
              $arrayElemAt: ['$package', 0]
            },
            posting_used: 1,
            comments_used: 1,
            featured_post_used: 1,
            start_date: 1,
            end_date: 1,
            current_active: 1
          }
        }
      ])
      .toArray()
  }
  //xóa vip user detail
  public async deleteVipUserDetail(id: string) {
    return await databaseService.vip_user_details.deleteOne({ _id: new ObjectId(id) })
  }
  // Lấy lịch sử vip của người dùng
  public async getVipUserHistoryByUserId(userId: string) {
    return await databaseService.vip_user_details
      .aggregate([
        {
          $lookup: {
            from: 'vip_packages',
            localField: 'package_id',
            foreignField: '_id',
            as: 'package'
          }
        },
        {
          $match: {
            user_id: new ObjectId(userId),
            current_active: false
          }
        },
        {
          $project: {
            package: {
              $arrayElemAt: ['$package', 0]
            },
            start_date: 1,
            end_date: 1,
            current_active: 1
          }
        }
      ])
      .toArray()
  }
  public async updateVipUserDetail(id: string, payload: VIP_USER_DETAIL_REQUEST_BODY) {
    return await databaseService.vip_user_details.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          user_id: new ObjectId(payload.user_id),
          package_id: new ObjectId(payload.package_id)
        }
      },
      { returnDocument: 'after' }
    )
  }
  public async getHistory(userId: string) {
    const results = await Promise.all([
      databaseService.vip_user_details
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
            $match: {
              user_id: new ObjectId(userId)
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
            $sort: {
              end_date: -1
            }
          },
          {
            $project: {
              user: {
                $arrayElemAt: ['$user', 0]
              },
              package: {
                $arrayElemAt: ['$package', 0]
              },
              start_date: 1,
              posting_used: 1,
              comments_used: 1,
              status: 1,
              featured_post_used: 1,
              end_date: 1,
              current_active: 1
            }
          }
        ])
        .toArray(),
      databaseService.vip_user_details.countDocuments({ user_id: new ObjectId(userId) })
    ])
    return {
      total: results[1],
      items: results[0]
    }
  }
  public async getAllVipUserDetails() {
    return await databaseService.vip_user_details.find().toArray()
  }
  public async getActiveCurrentVip(userId: string) {
    return await databaseService.vip_user_details
      .aggregate([
        {
          $lookup: {
            from: 'vip_packages',
            localField: 'package_id',
            foreignField: '_id',
            as: 'package'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            user_id: new ObjectId(userId),
            current_active: true
          }
        },
        {
          $project: {
            package: {
              $arrayElemAt: ['$package', 0]
            },
            user: {
              $arrayElemAt: ['$user', 0]
            },
            start_date: 1,
            posting_used: 1,
            comments_used: 1,
            featured_post_used: 1,
            status: 1,
            end_date: 1,
            current_active: 1
          }
        }
      ])
      .toArray()
  }
}
const vipUserDetailsService = new VipUserDetailsService()
export default vipUserDetailsService
