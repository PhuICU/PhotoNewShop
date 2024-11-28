import { FAVORITE_REQUEST_BODY } from '~/models/requests/favorites.schema'
import databaseService from './database.service'
import { FAVORITE_SCHEMA } from '~/models/schemas/Favorite.schema'
import { ObjectId } from 'mongodb'

class FavoritesService {
  async createFavorite(payload: FAVORITE_REQUEST_BODY) {
    return await databaseService.favorites.insertOne(
      new FAVORITE_SCHEMA({
        post_id: new ObjectId(payload.post_id),
        user_id: new ObjectId(payload.user_id)
      })
    )
  }
  async getFavoritesByUserId(user_id: string) {
    return await databaseService.favorites.find({ user_id: new ObjectId(user_id) }).toArray()
  }
  async getFavoriteById(id: string) {
    return await databaseService.favorites.findOne({ _id: new ObjectId(id) })
  }
  async deleteFavoriteById(id: string) {
    return await databaseService.favorites.deleteOne({ _id: new ObjectId(id) })
  }
  async deleteFavoriteByPostIdAndUserId(payload: FAVORITE_REQUEST_BODY) {
    return await databaseService.favorites.findOneAndDelete({
      post_id: new ObjectId(payload.post_id),
      user_id: new ObjectId(payload.user_id)
    })
  }
  async getFavoritesByUserIdAndPostId(user_id: string, post_id: string) {
    return await databaseService.favorites.findOne({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })
  }
  public async getAllFavoritesOfUser(user_id: string) {
    return await databaseService.favorites.find({ user_id: new ObjectId(user_id) }).toArray()
  }
}
const favoritesService = new FavoritesService()
export default favoritesService
