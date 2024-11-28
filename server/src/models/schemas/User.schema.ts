import { ObjectId } from 'mongodb'
import { ACCOUNT_TYPE, ROLE_TYPE, USER_VERIFY_STATUS } from '~/enums/user.enum'
import { ImageTypes, AddressTypes } from '~/type'
interface UserTypes {
  _id?: ObjectId
  full_name: string
  tax_code?: string
  invoice_info?: {
    i_name: string
    i_company_name: string
    i_tax_code: string
    i_email: string
  }
  phone?: string
  email: string
  password: string
  role?: ROLE_TYPE
  account_type: ACCOUNT_TYPE
  verify?: USER_VERIFY_STATUS
  avatar?: ImageTypes
  // Optional fields
  address?: AddressTypes
  forgot_password_token?: string
  email_verify_token?: string
  locked_posts?: ObjectId[]
  created_at?: Date
  updated_at?: Date
}
export class USER_SCHEMA {
  _id: ObjectId
  full_name: string
  tax_code: string
  invoice_info: {
    i_name: string
    i_company_name: string
    i_tax_code: string
    i_email: string
  }
  phone: string
  email: string
  password: string
  role: ROLE_TYPE
  verify: USER_VERIFY_STATUS
  account_type: ACCOUNT_TYPE
  avatar: ImageTypes
  // Optional fields
  address: AddressTypes
  forgot_password_token: string
  email_verify_token: string
  locked_posts: ObjectId[]
  created_at?: Date
  updated_at?: Date

  // Constructor
  constructor(user: UserTypes) {
    const date = new Date()
    this._id = user._id || new ObjectId()
    this.full_name = user.full_name || ''
    this.tax_code = user.tax_code || ''
    this.invoice_info = user.invoice_info || { i_name: '', i_company_name: '', i_tax_code: '', i_email: '' }
    this.phone = user.phone || ''
    this.email = user.email
    this.password = user.password
    this.role = user.role || ROLE_TYPE.USER
    this.verify = user.verify || USER_VERIFY_STATUS.UNVERIFIED
    this.account_type = user.account_type
    this.avatar = user.avatar || {
      _id: '',
      public_id: '',
      url: '',
      created_at: '',
      updated_at: ''
    }
    this.address = user.address || ({ details: '', street: '', province: '', district: '', ward: '' } as AddressTypes)
    this.forgot_password_token = user.forgot_password_token || ''
    this.email_verify_token = user.email_verify_token || ''
    this.locked_posts = user.locked_posts || []
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
