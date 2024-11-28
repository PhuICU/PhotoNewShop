export const calculateRaw = (views: number, createdAt: Date) => {
  const current_date = new Date()
  const diff = Math.abs(current_date.getTime() - createdAt.getTime()) // in milliseconds
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) // in days
  return views / diffDays // views per day since created
}
export const normalize = (rawRating: number, maxRating: number, minRating: number) => {
  if (maxRating === minRating) {
    return 0
  }
  return ((rawRating - minRating) / (maxRating - minRating)) * 5
}
