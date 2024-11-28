import { NEWS_REQUEST_BODY } from '~/models/requests/news.request'
import databaseService from './database.service'
import { NEWS_SCHEMA } from '~/models/schemas/News.schema'
import { ObjectId } from 'mongodb'

class NewsService {
  public async createNews(payload: NEWS_REQUEST_BODY, user_id: string) {
    return await databaseService.news.insertOne(
      new NEWS_SCHEMA({
        ...payload,
        posted_by: new ObjectId(user_id)
      })
    )
  }
  public async getNews() {
    return await databaseService.news.find().toArray()
  }
  public async getNewsById(id: string) {
    return await databaseService.news.findOne({ _id: new ObjectId(id) })
  }
  public async updateNewsById(id: string, payload: NEWS_REQUEST_BODY) {
    return await databaseService.news.updateOne({ _id: new ObjectId(id) }, { $set: payload })
  }
  public async deleteNewsById(id: string) {
    return await databaseService.news.deleteOne({ _id: new ObjectId(id) })
  }
  public async deleteManyNews(ids: string[]) {
    return await databaseService.news.deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
  }
  public async deleteAllNews() {
    return await databaseService.news.deleteMany({})
  }
}
const newsService = new NewsService()
export default newsService
