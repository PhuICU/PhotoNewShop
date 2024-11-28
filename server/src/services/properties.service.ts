import { PROPERTY_REQUEST_BODY } from '~/models/requests/properties.request'
import databaseService from './database.service'
import { PROPERTY_SCHEMA } from '~/models/schemas/Property.schema'
import { ObjectId } from 'mongodb'

class PropertiesService {
  async create(payload: PROPERTY_REQUEST_BODY) {
    return await databaseService.properties.insertOne(
      new PROPERTY_SCHEMA({
        ...payload
      })
    )
  }
  async getAll(name?: string) {
    return name
      ? await databaseService.properties
          .find({
            name: {
              $regex: new RegExp(name, 'i'),
              $options: 'i'
            }
          })
          .toArray()
      : await databaseService.properties.find().toArray()
  }
  async getOne(id: string) {
    return await databaseService.properties.findOne({ _id: new ObjectId(id) })
  }
  async update(id: string, payload: PROPERTY_REQUEST_BODY) {
    return await databaseService.properties.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...payload, updated_at: new Date() } }
    )
  }
  async deleteOne(id: string) {
    return await databaseService.properties.findOneAndDelete({ _id: new ObjectId(id) })
  }
  async deleteMany(ids: string[]) {
    return await databaseService.properties.deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } })
  }
  async deleteAll() {
    return await databaseService.properties.deleteMany({})
  }
}
const propertiesService = new PropertiesService()
export default propertiesService
