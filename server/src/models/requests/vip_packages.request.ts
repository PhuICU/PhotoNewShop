import { DISCOUNT_TYPE, UNIT_PRICE, VIP_PACKAGE_DURATION, VIP_PACKAGE_STATUS } from '~/enums/util.enum'

export interface VIP_PACKAGE_REQUEST_BODY {
  packageName: string
  price: number
  vip_score: number
  currency: UNIT_PRICE
  description: string
  features: string[]
  discount?: {
    discountPercentage: number
    discountAmount: number
    conditions: string
    startDate: string
    endDate: string
  }
  duration: VIP_PACKAGE_DURATION
  specialBenefits: string[]
  priviLeges: {
    postingLimit: {
      totalPost: number | string
      durationPerPost: number
    }
    commentPrivileges: {
      canComment: boolean
      commentLimit: number | string
    }
    trendingPrivileges: {
      canTrend: boolean
      trendingLimit: number | string
    }
  }
}
