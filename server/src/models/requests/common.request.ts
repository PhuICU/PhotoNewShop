import { ACCOUNT_TYPE, ROLE_TYPE } from '~/enums/user.enum'

export interface RegisterRequest {
  full_name: string
  email: string
  password: string
  account_type: ACCOUNT_TYPE
  role: ROLE_TYPE
  confirm_password?: string
}
export interface LoginRequest {
  email: string
  password: string
}
