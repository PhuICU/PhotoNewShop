export const handleConvertVNDToUSD = (amount: number) => {
  // Làm tròn 2 chữ số thập phân
  return Math.round((amount / 25420) * 100) / 100 
}