import { MESSAGE_REQUEST_BODY } from '~/models/requests/messages.quest'

import databaseService from './database.service'
import { MESSAGE_SCHEMA } from '~/models/schemas/Messages.schema'
import { ObjectId } from 'mongodb'

class MessagesService {
  async getMessages(chatId: string) {
    // Check if chatId is a valid 24-character hex string
    if (!ObjectId.isValid(chatId)) {
      throw new Error('Invalid chatId: must be a 24-character hex string.')
    }

    // Convert chatId to ObjectId and find messages
    return await databaseService.messages.find({ chatId: new ObjectId(chatId) }).toArray()
  }

  async createMessage(message: MESSAGE_REQUEST_BODY) {
    return await databaseService.messages.insertOne(
      new MESSAGE_SCHEMA({
        ...message,
        chatId: new ObjectId(message.chatId),
        senderId: new ObjectId(message.senderId),
        text: message.text
      })
    )
  }
}

const messagesService = new MessagesService()

export default messagesService
