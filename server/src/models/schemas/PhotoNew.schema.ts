import { ObjectId } from 'mongodb'
import { BUYING_STATUS, POST_STATUS, POST_TYPE } from '~/enums/util.enum'
import { AddressTypes, ImageTypes, VideoType } from '~/type'

interface PhotoNew {
  _id?: ObjectId
  title: string
  description: string
  //Thông tin giá trên m2
  // Thông tin địa chỉ
  address: AddressTypes
  // thông tin diện tích

  price: {
    value: number
    unit: 'Triệu' | 'Tỷ' | 'Trăm nghìn' | 'Nghìn'
    is_for_sell: boolean // true: bán, false: cho thuê
    is_negotiable: boolean // có thể thương lượng
    // thuê theo tháng hay năm
    rental_period: string
    deposit: number // tiền cọc
  }
  // thông tin liên hệ
  contact_info: {
    contact_name: string
    contact_phone: string
    contact_email: string
  }
  // Đánh giá
  rating?: number

  type: POST_TYPE // Loại tin đăng ví dụ: "sell" | "rent"
  // thông tin hình ảnh
  images: ImageTypes[]
  videos?: VideoType[]
  // thông tin mua bán
  buying_status?: BUYING_STATUS
  // thông tin người đăng
  posted_by: ObjectId // Người đăng
  // thông tin trạng thái
  status?: POST_STATUS
  // thông tin loại
  property_type_id: ObjectId
  view?: number
  // thời gian tồn tại tin
  time_existed: number //ví dụ: 30 ngày

  // Ngày đăng tin
  published_at?: Date
  score?: number
  is_priority?: boolean
  vip?: {
    is_vip: boolean
    vip_name: string
    vip_score: number
    is_featured: boolean // tin nổi bật
    is_top: boolean // tin xu hướng
    trendPosition: number
  }
  // Ngày hết hạn
  expired_at?: Date
  updated_at?: Date
  //tự đông tạo
  create_at?: Date
}
export class PHOTO_NEW_SCHEMA {
  _id: ObjectId
  title: string
  description: string
  //Thông tin giá
  price: {
    value: number
    unit: 'Triệu' | 'Tỷ' | 'Trăm nghìn' | 'Nghìn'
    is_for_sell: boolean // true: bán, false: cho thuê
    is_negotiable: boolean // có thể thương lượng
    // thuê theo tháng hay năm
    rental_period: string // 'month' | 'year' | 'none'
    deposit: number // tiền cọc
  }
  // Thông tin địa chỉ
  address: AddressTypes

  score: number
  is_priority: boolean
  vip: {
    is_vip: boolean
    vip_name: string
    vip_score: number
    is_featured: boolean // tin nổi bật
    is_top: boolean // tin xu hướng
    trendPosition: number
  }
  // thông tin liên hệ
  contact_info: {
    contact_name: string
    contact_phone: string
    contact_email: string
  }
  // Đánh giá
  rating: number
  // hướng
  type: POST_TYPE // Loại tin đăng
  // thông tin hình ảnh
  images: ImageTypes[]
  videos: VideoType[]
  // thông tin mua bán
  buying_status: BUYING_STATUS
  // thông tin người đăng
  posted_by: ObjectId // Người đăng
  // thông tin trạng thái
  status: POST_STATUS
  // thông tin loại tin
  property_type_id: ObjectId
  view: number
  // thời gian tồn tại tin
  time_existed: number //ví dụ: 30 ngày
  // Ngày đăng tin
  published_at: Date
  // Ngày hết hạn
  expired_at: Date
  updated_at: Date
  create_at: Date

  constructor(data: PhotoNew) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.title = data.title
    this.is_priority = data.is_priority || false
    this.description = data.description
    this.address = data.address
    this.price = data.price

    this.vip = data.vip || {
      is_vip: false,
      is_featured: false,
      is_top: false,
      vip_score: 0,
      vip_name: '',
      trendPosition: 0
    }
    this.contact_info = data.contact_info
    this.rating = data.rating || 0
    this.type = data.type
    this.images = data.images
    this.videos = data.videos || []
    this.buying_status = data.buying_status || BUYING_STATUS.OPEN
    this.posted_by = data.posted_by
    this.status = data.status || POST_STATUS.PENDING
    this.property_type_id = data.property_type_id
    this.view = data.view || 0
    this.time_existed = data.time_existed || 7
    this.score = data.score || 0
    this.published_at = data.published_at || date
    this.expired_at = data.expired_at || new Date(date.setDate(date.getDate() + data.time_existed))
    this.updated_at = data.updated_at || new Date()
    this.create_at = new Date()
  }
}
