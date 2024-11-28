import { ObjectId } from 'mongodb'
import { VIP_STATUS } from '~/enums/util.enum'

interface VipUserDetailType {
  _id?: ObjectId
  user_id: ObjectId
  package_id: ObjectId
  start_date: Date
  end_date: Date
  posting_used?: number
  status?: VIP_STATUS
  // số lượng comment đã sử dụng
  comments_used?: number
  featured_posts_used?: number // số lượng tin đăng được lên xu hướng
  current_active?: boolean
  created_at?: Date
  updated_at?: Date
}
export class VIP_USER_DETAIL_SCHEMA {
  _id: ObjectId
  user_id: ObjectId
  package_id: ObjectId
  start_date: Date
  end_date: Date
  posting_used: number
  comments_used: number
  featured_posts_used: number
  status: VIP_STATUS
  current_active: boolean
  created_at: Date
  updated_at: Date
  constructor(data: VipUserDetailType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.user_id = data.user_id
    this.package_id = data.package_id
    this.start_date = data.start_date
    this.end_date = data.end_date
    this.comments_used = data.comments_used || 0
    this.featured_posts_used = data.featured_posts_used || 0
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
    this.posting_used = data.posting_used || 0
    this.current_active = data.current_active || true
    this.status = data.status || VIP_STATUS.ACTIVE
  }
}
