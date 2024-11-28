import { ObjectId } from 'mongodb'

interface ImageType {
  _id?: ObjectId
  public_id: string
  url: string
  created_at?: Date
  updated_at?: Date
}
export class IMAGE_SCHEMA {
  _id?: ObjectId
  public_id: string
  url: string
  created_at: Date
  updated_at: Date
  constructor(data: ImageType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.public_id = data.public_id
    this.url = data.url
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
