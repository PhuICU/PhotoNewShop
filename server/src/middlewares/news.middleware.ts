import { checkSchema } from 'express-validator'
import { title } from 'process'
import validateSchema from '~/utils/validation'

const createNewsValidator = validateSchema(
  checkSchema({
    title: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tiêu đề tin tức không được để trống'
      }
    },
    description: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Mô tả tin tức không được để trống'
      }
    },
    content: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Nội dung tin tức không được để trống'
      }
    },
    'content.*.sub_title': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tiêu đề phụ không được để trống'
      }
    },
    'content.*.sub_content': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Nội dung phụ không được để trống'
      }
    },
    'content.*.images': {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Hình ảnh không được để trống'
      }
    }
  })
)

const newsMiddlewares = {
  createNewsValidator
}
export default newsMiddlewares
