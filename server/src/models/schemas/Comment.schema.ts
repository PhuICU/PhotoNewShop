import { ObjectId } from 'mongodb'

interface CommentType {
  _id?: ObjectId
  post_id: ObjectId
  user_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
}
export class COMMENT_SCHEMA {
  _id?: ObjectId
  post_id: ObjectId
  user_id: ObjectId
  content: string
  created_at: Date
  updated_at: Date
  constructor(data: CommentType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.post_id = data.post_id
    this.user_id = data.user_id
    this.content = data.content
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
