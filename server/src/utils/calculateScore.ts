import { PHOTO_NEW_SCHEMA } from '~/models/schemas/PhotoNew.schema'

export const calculateScoreWhenView = async (post: PHOTO_NEW_SCHEMA) => {
  return (post.score += 0.5)
}
export const calculateScoreWhenLike = async (post: PHOTO_NEW_SCHEMA) => {
  return (post.score += 1)
}
export const calculateScoreWhenComment = async (post: PHOTO_NEW_SCHEMA) => {
  return (post.score += 2)
}
