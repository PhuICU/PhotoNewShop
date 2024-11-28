import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import messagesService from '../services/messages.sevice'
import { MESSAGE_REQUEST_BODY } from '../models/requests/messages.quest'
import { responseError, responseSuccess } from '../utils/response'
import { MESSAGE_SCHEMA } from '~/models/schemas/Messages.schema'

const createMessage = async (req: Request<ParamsDictionary, any, MESSAGE_REQUEST_BODY, any>, res: Response) => {
  const payload = req.body

  const result = await messagesService.createMessage(payload)

  if (!result) {
    return responseError(res, {
      message: 'Tạo message thất bại'
    })
  }
  return responseSuccess(res, {
    message: 'Tạo message thành công',
    data: result
  })
}

const getMessages = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { chatId } = req.params
  const result = await messagesService.getMessages(chatId)
  return responseSuccess(res, {
    message: 'Lấy danh sách message thành công',
    data: result
  })
}

const messageController = {
  createMessage,
  getMessages
}

export default messageController
