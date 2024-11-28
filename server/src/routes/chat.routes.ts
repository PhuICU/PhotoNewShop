import { Router } from 'express'
import chatController from '~/controllers/chat.controller'
import commonMiddlewares from '~/middlewares/common.middleware'

const chatRoutes = Router()

chatRoutes.post('/create', chatController.createChat)
chatRoutes.get('/all/:firstId/:secondId', chatController.getChats)
chatRoutes.get('/:userId', chatController.getChatsOfUser)
chatRoutes.get('/chat/:chatId', chatController.getChatById)

export default chatRoutes
