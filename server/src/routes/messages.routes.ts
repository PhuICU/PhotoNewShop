import { Router } from 'express'
import messageController from '~/controllers/message.controller'
import commonMiddlewares from '~/middlewares/common.middleware'

const messageRoutes = Router()

messageRoutes.post('/create', messageController.createMessage)
messageRoutes.get('/:chatId', messageController.getMessages)

export default messageRoutes
