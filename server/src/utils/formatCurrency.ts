import { DISCOUNT_TYPE } from '~/enums/util.enum'

export function formatCurrency(amount: number): string {
  // Use toLocaleString to format the number with commas
  const formattedAmount = amount.toLocaleString('vi-VN')
  // Append the currency symbol
  return `${formattedAmount} ₫ `
}

export function handlePriceDiscount(
  price: number,
  discount: {
    discountPercentage: number
    discountAmount: number
    conditions: string
    startDate: Date | null
    endDate: Date | null
  }
): number {
  const { discountPercentage, discountAmount, conditions, startDate, endDate } = discount
  const currentDate = new Date()
  const isDiscountValid = startDate && endDate && startDate <= currentDate && currentDate <= endDate
  if (isDiscountValid) {
    price = price - (price * discountPercentage) / 100
    return price
  } else return price
}
