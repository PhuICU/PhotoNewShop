import { REFRESH_TOKEN_SCHEMA } from '~/models/schemas/RefreshToken.schema'
import databaseService from './database.service'
import { ObjectId } from 'mongodb'

class RefreshTokenService {
  async createRefreshToken(userId: string, token: string) {
    return databaseService.refresh_tokens.insertOne(
      new REFRESH_TOKEN_SCHEMA({
        user_id: new ObjectId(userId),
        token
      })
    )
  }
  async findToken(token: string) {
    return databaseService.refresh_tokens.findOne({ token })
  }
  async deleteToken(token: string) {
    return databaseService.refresh_tokens.deleteOne({ token })
  }
}
const refreshTokenService = new RefreshTokenService()
export default refreshTokenService
