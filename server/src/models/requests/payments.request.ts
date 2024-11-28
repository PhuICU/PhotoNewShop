import { PAYMENT_METHOD, UNIT_PRICE } from '~/enums/util.enum'

export interface PAYMENT_REQUEST_BODY {
  package_id: string
  payment_method: PAYMENT_METHOD // paypal, stripe, vnPay
  is_paid: boolean
  amount: number
  payment_date: string
  currency: UNIT_PRICE
}
