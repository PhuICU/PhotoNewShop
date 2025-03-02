import { CHAT_REQUEST_BODY } from '~/models/requests/chat.quest'
import databaseService from './database.service'
import { CHAT_SCHEMA } from '~/models/schemas/Chat.schema'
import { ObjectId } from 'mongodb'
import { ErrorWithMessage } from '~/utils/error'

class ChatService {
  async createChat(chat: CHAT_REQUEST_BODY) {
    const chatExist = await databaseService.chats.findOne({
      member: { $all: [new ObjectId(chat.member[0]), new ObjectId(chat.member[1])] }
    })

    if (chatExist) {
      throw new ErrorWithMessage({ message: 'Chat đã tồn tại', status: 400 })
    }

    console.log(chat)

    return await databaseService.chats.insertOne({
      _id: new ObjectId(),
      member: chat.member.map((id) => new ObjectId(id)),
      messages: [],
      created_at: new Date(),
      updated_at: new Date()
    } as CHAT_SCHEMA)
  }

  async getChats(chat: CHAT_REQUEST_BODY) {
    return await databaseService.chats.findOne({
      member: { $all: [new ObjectId(chat.member[0]), new ObjectId(chat.member[1])] }
    })
  }

  async getUsersChat(userId: string) {
    return await databaseService.chats.find({ member: { $in: [new ObjectId(userId)] } }).toArray()
  }

  async findChatById(id: string) {
    return await databaseService.chats.findOne({ _id: new ObjectId(id) })
  }
}

const chatService = new ChatService()

export default chatService
