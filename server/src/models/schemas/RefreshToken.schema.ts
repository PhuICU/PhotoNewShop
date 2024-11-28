import { ObjectId } from 'mongodb'

interface refresh_token_type {
  _id?: ObjectId
  user_id: ObjectId
  token: string
  created_at?: Date
  updated_at?: Date
}
export class REFRESH_TOKEN_SCHEMA {
  _id: ObjectId
  user_id: ObjectId
  token: string
  created_at: Date
  updated_at: Date
  constructor(data: refresh_token_type) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.user_id = data.user_id
    this.token = data.token
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
