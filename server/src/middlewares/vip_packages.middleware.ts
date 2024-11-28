import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validation'

/**
 packageName: string
  price: number
  currency: UNIT_PRICE
  description: string
  features: string[]
  discount: {
    discountPercentage: number
    discountAmount: number
    conditions: string
    startDate: Date
    endDate: Date
  }
  duration: VIP_PACKAGE_DURATION
  specialBenefits: string[]
  priviLeges: {
    postingLimit: {
      totalPost: number
      durationPerPost: number
    }
    commentPrivileges: {
      canComment: boolean
      commentLimit: number
    }
    trendingPrivileges: {
      canTrend: boolean
      trendingLimit: number
    }
  }
 */
const createVipPackageValidator = validateSchema(
  checkSchema({
    packageName: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tên gói VIP không được để trống'
      }
    },
    price: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Giá tiền không được để trống'
      },
      isNumeric: {
        errorMessage: 'Giá tiền phải là số'
      }
    },
    currency: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Loại tiền không được để trống'
      }
    },
    description: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Mô tả không được để trống'
      }
    },
    features: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Danh sách tính năng không được để trống'
      }
    },
    discount: {
      optional: true,
      isObject: {
        errorMessage: 'Discount phải là đối tượng'
      }
    },
    // 'discount.discountPercentage': {
    //   in: ['body'],
    //   notEmpty: {
    //     errorMessage: 'Phần trăm giảm giá không được để trống'
    //   },
    //   isNumeric: {
    //     errorMessage: 'Phần trăm giảm giá phải là số'
    //   }
    // },
    // 'discount.discountAmount': {
    //   in: ['body'],
    //   notEmpty: {
    //     errorMessage: 'Số tiền giảm giá không được để trống'
    //   },
    //   isNumeric: {
    //     errorMessage: 'Số tiền giảm giá phải là số'
    //   }
    // },
    // 'discount.conditions': {
    //   in: ['body'],
    //   optional: true
    // },
    // 'discount.startDate': {
    //   in: ['body'],
    //   notEmpty: {
    //     errorMessage: 'Ngày bắt đầu giảm giá không được để trống'
    //   }
    // },
    // 'discount.endDate': {
    //   in: ['body'],
    //   notEmpty: {
    //     errorMessage: 'Ngày kết thúc giảm giá không được để trống'
    //   }
    // },
    duration: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Thời lượng gói VIP không được để trống'
      }
    },
    specialBenefits: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Danh sách quyền lợi đặc biệt không được để trống'
      }
    },
    'priviLeges.postingLimit.totalPost': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Số lượng bài viết không được để trống'
      }
    },
    'priviLeges.postingLimit.durationPerPost': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Thời lượng mỗi bài viết không được để trống'
      },
      isNumeric: {
        errorMessage: 'Thời lượng mỗi bài viết phải là số'
      }
    },
    'priviLeges.commentPrivileges.canComment': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Quyền bình luận không được để trống'
      },
      isBoolean: {
        errorMessage: 'Quyền bình luận phải là boolean'
      }
    },
    'priviLeges.commentPrivileges.commentLimit': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Số lượng bình luận không được để trống'
      }
    },
    'priviLeges.trendingPrivileges.canTrend': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Quyền trending không được để trống'
      },
      isBoolean: {
        errorMessage: 'Quyền trending phải là boolean'
      }
    },
    'priviLeges.trendingPrivileges.trendingLimit': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Số lượng trending không được để trống'
      }
    }
  })
)
const vipPackagesMiddlewares = {
  createVipPackageValidator
}
export default vipPackagesMiddlewares
