import { ObjectId } from 'mongodb'

interface ChatType {
  _id?: ObjectId
  member: Array<ObjectId>
  created_at: Date
  updated_at: Date
}

export class CHAT_SCHEMA {
  _id: ObjectId
  member: Array<ObjectId>
  created_at: Date
  updated_at: Date

  constructor(chat: ChatType) {
    this._id = new ObjectId()
    this.member = chat.member
    this.created_at = chat.created_at
    this.updated_at = chat.updated_at
  }
}
