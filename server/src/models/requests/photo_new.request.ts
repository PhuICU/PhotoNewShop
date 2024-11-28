import { POST_TYPE, BUYING_STATUS, POST_STATUS } from '~/enums/util.enum'
import { AddressTypes, ImageTypes, VideoType } from '~/type'

export type PHOTO_NEW_REQUEST_BODY = {
  title: string
  description: string
  //Thông tin giá
  price: {
    value: number
    unit: 'Triệu' | 'Tỷ' | 'Trăm nghìn' | 'Nghìn'
    is_for_sell: boolean // true: bán, false: cho thuê
    is_negotiable: boolean // có thể thương lượng
    rental_period: string
    deposit: number // tiền cọc
  }
  // Thông tin địa chỉ
  address: AddressTypes

  is_priority?: boolean
  // Thoong tin vip
  // Đánh dấu tin xu hướng
  is_trend?: boolean
  vip?: {
    is_vip: boolean
    vip_name: string
    is_top: boolean
    vip_score: number
    trendPosition: number
    is_featured: boolean
  }
  // thông tin liên hệ
  contact_info: {
    contact_name: string
    contact_phone: string
    contact_email: string
  }
  score: number
  type: POST_TYPE // Loại tin đăng ví dụ: "sell" | "rent"
  // thông tin hình ảnh
  images: ImageTypes[]
  videos: VideoType[]
  // thông tin mua bán
  buying_status?: BUYING_STATUS
  // thông tin người đăng
  posted_by?: string // Người đăng
  // thông tin trạng thái
  status: POST_STATUS
  // thông tin loại
  property_type_id: string
  view: number
  // thời gian tồn tại tin
  time_existed: number //ví dụ: 30 ngày
  // Ngày đăng tin
  published_at?: Date
  // Ngày hết hạn
  created_at?: Date
  updated_at?: Date
}
// queries
export type PHOTO_NEW_QUERY = {
  title?: string
  price?: number
  address?: AddressTypes
  posted_by?: string
  // hướng

  type?: POST_TYPE // Loại tin đăng
  image?: ImageTypes[]
  buying_status?: BUYING_STATUS
  property_type_id?: string
  rating?: number | string
  page?: number | string
  limit?: number | string
  sort_by?: 'title' | 'price' | 'area'
  order_by?: 'asc' | 'desc'
  // thời gian tồn tại tin
}
