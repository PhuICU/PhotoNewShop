import { AddressTypes, ImageTypes } from '~/type'

export interface UserProfile {
  full_name: string
  tax_code: string
  phone: string
  email: string
  avatar: ImageTypes
  address: AddressTypes
  // thông tin xuất hóa đơn
  invoice_info: {
    i_name: string
    i_company_name: string
    i_tax_code: string
    i_email: string
  }
}
