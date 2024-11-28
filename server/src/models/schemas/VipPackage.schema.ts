import { ObjectId } from 'mongodb'
import { UNIT_PRICE, VIP_PACKAGE_DURATION, VIP_PACKAGE_STATUS } from '~/enums/util.enum'

interface VipPackageType {
  _id?: ObjectId
  packageName: string
  price: number
  currency: UNIT_PRICE
  vip_score: number
  description: string
  features: string[]
  discount?: {
    discountPercentage: number
    discountAmount: number
    conditions: string
    startDate: Date | null
    endDate: Date | null
  }
  duration: VIP_PACKAGE_DURATION
  specialBenefits: string[]
  status?: VIP_PACKAGE_STATUS
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
  created_at?: Date
  updated_at?: Date
}
export class VIP_PACKAGE_SCHEMA {
  _id?: ObjectId
  packageName: string
  price: number
  currency: UNIT_PRICE
  vip_score: number
  description: string
  features: string[]
  discount: {
    discountPercentage: number
    discountAmount: number
    conditions: string
    startDate: Date | null
    endDate: Date | null
  }
  duration: VIP_PACKAGE_DURATION
  specialBenefits: string[]
  status: VIP_PACKAGE_STATUS
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
  created_at?: Date
  updated_at?: Date
  constructor(data: VipPackageType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.packageName = data.packageName
    this.price = data.price
    this.currency = data.currency
    this.description = data.description
    this.features = data.features
    this.discount = data.discount || {
      discountPercentage: 0,
      discountAmount: 0,
      conditions: '',
      startDate: null,
      endDate: null
    }
    this.duration = data.duration
    this.specialBenefits = data.specialBenefits
    this.priviLeges = data.priviLeges
    this.vip_score = data.vip_score
    this.status = data.status || VIP_PACKAGE_STATUS.ACTIVE
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
