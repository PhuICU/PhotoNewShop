import { checkSchema } from 'express-validator'
import validateSchema from '~/utils/validation'

const updateProfileVaidator = validateSchema(
  checkSchema({
    full_name: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Tên không được để trống'
      }
    },
    tax_code: {
      in: ['body'],
      optional: true,
      isLength: {
        options: { min: 10, max: 10 },
        errorMessage: 'Mã số thuế phải có 10 ký tự'
      },
      isString: {
        errorMessage: 'Mã số thuế không hợp lệ'
      }
    },
    phone: {
      in: ['body'],
      optional: true,
      isMobilePhone: {
        options: ['vi-VN'],
        errorMessage: 'Số điện thoại không hợp lệ'
      }
    },
    email: {
      in: ['body'],
      notEmpty: {
        errorMessage: 'Email không được để trống'
      },
      isEmail: {
        errorMessage: 'Email không hợp lệ'
      }
    },
    avatar: {
      in: ['body'],
      optional: true
    },
    address: {
      in: ['body'],
      optional: true
    },
    invoice_info: {
      in: ['body'],
      optional: true
    }
  })
)
const usersMiddlewares = {
  updateProfileVaidator
}
export default usersMiddlewares
