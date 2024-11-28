import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { FAVORITE_REQUEST_BODY } from '~/models/requests/favorites.schema'
import favoritesService from '~/services/favorites.service'
import realEstateNewsService from '~/services/photo_news.service'
import { TokenPayload } from '~/type'
import { responseSuccess } from '~/utils/response'
const createFavorite = async (req: Request<ParamsDictionary, any, FAVORITE_REQUEST_BODY, any>, res: Response) => {
  const { post_id } = req.body
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await favoritesService.createFavorite({ post_id, user_id })
  const post = await realEstateNewsService.getById(post_id)
  if (!post) {
    return responseSuccess(res, {
      message: 'Không tìm thấy tin đăng',
      data: null
    })
  }
  await realEstateNewsService.updateScore(post_id, post.score + 1)
  return responseSuccess(res, {
    message: 'Favorite created successfully',
    data: result
  })
}
const unFavorite = async (req: Request<ParamsDictionary, any, FAVORITE_REQUEST_BODY, any>, res: Response) => {
  const { id } = req.params
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await favoritesService.deleteFavoriteByPostIdAndUserId({ post_id: id, user_id })
  if (!result) {
    return responseSuccess(res, {
      message: 'Không tìm thấy yêu thích để xóa',
      data: result
    })
  }
  return responseSuccess(res, {
    message: 'Bỏ yêu thích thành công',
    data: result
  })
}

const getFavoritesByUserIdAndPostId = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { post_id } = req.query
  const { user_id } = req.decoded_access_token as TokenPayload
  if (!user_id || !post_id) {
    return responseSuccess(res, {
      message: 'Thiếu thông tin user_id hoặc post_id',
      data: []
    })
  }
  console.log(user_id, post_id)
  const result = await favoritesService.getFavoritesByUserIdAndPostId(user_id as string, post_id as string)
  console.log(result)
  return responseSuccess(res, {
    message: 'Truy xuất lượt thích thành công',
    data: result
  })
}
const getAllFavoritesOfUser = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await favoritesService.getAllFavoritesOfUser(user_id)
  const post_ids = result.map((item) => item.post_id)
  return responseSuccess(res, {
    message: 'Truy xuất tất cả lượt thích của user thành công',
    data: {
      post_ids
    }
  })
}
const getAllFavoritePostsByUserId = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await favoritesService.getAllFavoritesOfUser(user_id)
  const post_ids = result.map((item) => item.post_id)
  const posts = await realEstateNewsService.getAllFavoritePostsByUserId(post_ids.map((item) => item.toString()))

  return responseSuccess(res, {
    message: 'Truy xuất tất cả bài viết đã thích của user thành công',
    data: posts || []
  })
}
const favoritesControllers = {
  createFavorite,
  unFavorite,
  getFavoritesByUserIdAndPostId,
  getAllFavoritesOfUser,
  getAllFavoritePostsByUserId
}
export default favoritesControllers
