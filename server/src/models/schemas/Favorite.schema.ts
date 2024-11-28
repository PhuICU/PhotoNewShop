import { ObjectId } from 'mongodb'

interface FavoriteType {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

export class FAVORITE_SCHEMA {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at: Date
  updated_at: Date
  constructor(data: FavoriteType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.user_id = data.user_id
    this.post_id = data.post_id
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
