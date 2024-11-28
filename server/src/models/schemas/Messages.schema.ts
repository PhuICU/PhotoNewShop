import { ObjectId } from 'mongodb'

export interface MessageType {
  _id?: ObjectId
  chatId: ObjectId
  senderId: ObjectId
  text: string
  //   receiverId: ObjectId
  created_at: Date
  updated_at: Date
}

export class MESSAGE_SCHEMA {
  _id: ObjectId
  chatId: ObjectId
  senderId: ObjectId
  text: string
  //   receiverId: ObjectId
  created_at: Date
  updated_at: Date

  constructor(chat: MessageType | any) {
    const date = new Date()
    this._id = chat._id || new ObjectId()
    this.chatId = chat.chatId
    this.senderId = chat.senderId
    this.text = chat.text
    // this.receiverId = chat.receiverId
    this.created_at = chat.created_at || date
    this.updated_at = chat.updated_at || date
  }
}
