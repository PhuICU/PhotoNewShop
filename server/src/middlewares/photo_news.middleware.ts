import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validation'

/**
 title: string
  description: string
  //Thông tin giá
  price: {
    value: number
    unit: string
    is_for_sell: boolean // true: bán, false: cho thuê
    is_negotiable: boolean // có thể thương lượng
    rental_period: 'month' | 'year' | 'none'
    deposit: number // tiền cọc
  }
  // Thông tin địa chỉ
  address: AddressTypes
  // thông tin diện tích
  // thông tin về kích thước
  size: {
    width: number
    height: number
  }
  // Thông tin mặt tiền
  frontage?: number // Mặt tiền (m)
  // Thông tin đường vào
  entrance?: number // Đường vào (m)
  // Thông tin hướng
  direction: DIRECTION
  // thông tin liên hệ
  contact_info: {
    contact_name: string
    contact_phone: string
    contact_email: string
  }
  type: POST_TYPE // Loại tin đăng ví dụ: "sell" | "rent"
  // thông tin hình ảnh
  image: ImageTypes[]
  // thông tin mua bán
  buying_status: BUYING_STATUS
  // thông tin người đăng
  posted_by: string // Người đăng
  // thông tin trạng thái
  status: POST_STATUS
  // thông tin loại tin
  property_type_id: string
  view: number
  // thời gian tồn tại tin
  time_existed: number //ví dụ: 30 ngày
  // tiện ích nội ngoại khu
  number_of_bedrooms: number // Số phòng ngủ
  number_of_toilets: number // Số phòng vệ sinh
  number_of_floors: number // Số tầng
  // thông tin pháp lý
  legal_infor: string // Thông tin pháp lý (sổ đỏ, sổ hồng, giấy tờ hợp lệ)
  // thông tin nội thất
  furniture: string // Nội thất: "full" | "basic" | "none
  // tiện ích nội ngoại khu
  internal_amenities: string[]
  external_amenities: string[]
  // Ngày đăng tin
  published_at: Date
 */
const createValidator = validateSchema(
  checkSchema({
    title: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tiêu đề không được để trống'
      },
      isString: {
        errorMessage: 'Tiêu đề định dạng không hợp lệ'
      }
    },
    description: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Mô tả không được để trống'
      },
      isString: {
        errorMessage: 'Mô tả định dạng không hợp lệ'
      }
    },
    price: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Giá không được để trống'
      },
      isObject: {
        errorMessage: 'Giá định dạng không hợp lệ'
      }
    },
    'price.value': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Giá trị không được để trống'
      },
      isNumeric: {
        errorMessage: 'Giá trị phải là số'
      }
    },
    'price.unit': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Đơn vị không được để trống'
      },
      isString: {
        errorMessage: 'Đơn vị định dạng không hợp lệ'
      }
    },
    'price.is_for_sell': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Loại không được để trống'
      },
      isBoolean: {
        errorMessage: 'Loại phải là boolean'
      }
    },
    'price.is_negotiable': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Có thể thương lượng không được để trống'
      },
      isBoolean: {
        errorMessage: 'Có thể thương lượng phải là boolean'
      }
    },
    'price.rental_period': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Kỳ hạn không được để trống'
      },
      isString: {
        errorMessage: 'Kỳ hạn định dạng không hợp lệ'
      }
    },
    'price.deposit': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tiền cọc không được để trống'
      },
      isNumeric: {
        errorMessage: 'Tiền cọc phải là số'
      }
    },
    address: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Địa chỉ không được để trống'
      }
    },
    'address.province': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Thành phố không được để trống'
      },
      isString: {
        errorMessage: 'Thành phố định dạng không hợp lệ'
      }
    },
    'address.district': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Quận không được để trống'
      },
      isString: {
        errorMessage: 'Quận định dạng không hợp lệ'
      }
    },
    'address.ward': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Phường không được để trống'
      },
      isString: {
        errorMessage: 'Phường định dạng không hợp lệ'
      }
    },
    'address.details': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Địa chỉ chi tiết không được để trống'
      },
      isString: {
        errorMessage: 'Địa chỉ chi tiết định dạng không hợp lệ'
      }
    },

    contact_info: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Thông tin liên hệ không được để trống'
      }
    },
    'contact_info.contact_name': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tên liên hệ không được để trống'
      },
      isString: {
        errorMessage: 'Tên liên hệ định dạng không hợp lệ'
      }
    },
    'contact_info.contact_phone': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Số điện thoại không được để trống'
      },
      isString: {
        errorMessage: 'Số điện thoại định dạng không hợp lệ'
      }
    },
    'contact_info.contact_email': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Email không được để trống'
      },
      isEmail: {
        errorMessage: 'Email định dạng không hợp lệ'
      }
    },
    type: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Loại tin không được để trống'
      },
      isString: {
        errorMessage: 'Loại tin định dạng không hợp lệ'
      }
    },
    images: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Hình ảnh không được để trống'
      }
    },
    videos: {
      in: ['body'],
      optional: true
      // notEmpty: {
      //   errorMessage: 'Video không được để trống'
      // }
    },
    property_type_id: {
      in: ['body'],
      // notEmpty: {
      //   errorMessage: 'Loại tin không được để trống'
      // },
      isString: {
        errorMessage: 'Loại tin định dạng không hợp lệ'
      }
    }
  })
)
const photoNewsMiddlewares = {
  createValidator
}
export default photoNewsMiddlewares
