import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import httpStatusCode from '~/constants/httpStatusCode'
import messages from '~/constants/message'
import { ACCOUNT_TYPE, ROLE_TYPE } from '~/enums/user.enum'
import userService from '~/services/users.service'
import vipUserDetailsService from '~/services/vip_user_detail.service'
import { TokenPayload } from '~/type'
import hashPassword from '~/utils/crypto'
import { ErrorWithMessage } from '~/utils/error'
import JwtModule from '~/utils/jwt'
import { responseError } from '~/utils/response'
import validateSchema from '~/utils/validation'

const registerBodyValidator = validateSchema(
  checkSchema(
    {
      full_name: {
        notEmpty: {
          errorMessage: messages.errors.register.full_name.required
        },
        isLength: {
          errorMessage: messages.errors.register.full_name.min,
          options: { min: 2, max: 50 }
        }
      },
      email: {
        notEmpty: {
          errorMessage: messages.errors.register.email.required
        },
        isEmail: {
          errorMessage: messages.errors.register.email.invalid
        },
        //check existed email
        custom: {
          options: async (value) => {
            const user = await userService.findExistedEmail(value)
            if (user) {
              throw new Error(messages.errors.register.email.exists)
            } else return true
          }
        }
      },
      role: {
        optional: true,
        custom: {
          options: async (value) => {
            if (!Object.values(ROLE_TYPE).includes(value)) {
              throw new Error(messages.errors.register.role.invalid)
            } else return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: messages.errors.register.password.required
        },
        isLength: {
          errorMessage: messages.errors.register.password.min,
          options: { min: 6, max: 150 }
        }
      },
      account_type: {
        notEmpty: { errorMessage: messages.errors.register.account_type.require },
        custom: {
          options: async (value) => {
            if (!Object.values(ACCOUNT_TYPE).includes(value)) {
              throw new Error(messages.errors.register.account_type.invalid)
            } else return true
          }
        }
      },
      confirm_password: {
        optional: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(messages.errors.register.confirm_password.not_match)
            } else return true
          }
        }
      }
    },
    ['body']
  )
)
const loginBodyValidator = validateSchema(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: messages.errors.register.email.required
        },
        isEmail: {
          errorMessage: messages.errors.register.email.invalid
        },
        //check existed email
        custom: {
          options: async (value) => {
            const user = await userService.findExistedEmail(value)
            if (!user) {
              throw new ErrorWithMessage({ message: messages.errors.login.errors.invalid, status: 403 })
            } else return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: messages.errors.register.password.required
        },
        isLength: {
          errorMessage: messages.errors.register.password.min,
          options: { min: 6, max: 150 }
        },
        custom: {
          options: async (value, { req }) => {
            const user = await userService.findExistedEmail(req.body.email)
            if (user) {
              const password = hashPassword(value)
              if (password !== user.password) {
                throw new ErrorWithMessage({
                  message: messages.errors.login.errors.invalid,
                  status: httpStatusCode.UNAUTHORIZED
                })
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
const accessTokenValidator = validateSchema(
  checkSchema({
    Authorization: {
      in: ['headers'],
      notEmpty: {
        errorMessage: messages.errors.logout.at_required
      },
      custom: {
        options: async (value: string, { req }) => {
          const access_token = value.split(' ')[1] // Bearer token => token
          try {
            const decoded_at = await JwtModule.verifyAccessToken(access_token)
            req.decoded_access_token = decoded_at
            return true
          } catch (error) {
            throw new ErrorWithMessage({ message: (error as Error).message, status: httpStatusCode.UNAUTHORIZED })
          }
        }
      }
    }
  })
)
const refreshTokenValidator = validateSchema(
  checkSchema({
    refresh_token: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.unauthorized.rt_required
      },
      custom: {
        options: async (value, { req }) => {
          const refresh_token = value as string
          return await JwtModule.verifyRefreshToken(refresh_token, req as Request)
        }
      }
    }
  })
)
const verifyEmailValidator = validateSchema(
  checkSchema({
    token: {
      in: ['query'],
      notEmpty: {
        errorMessage: messages.errors.unauthorized.verify_email.required
      },
      custom: {
        options: async (value, { req }) => {
          try {
            const decoded_token = await JwtModule.verifyEmailVerifyToken(value)
            req.decoded_email_verify_token = decoded_token
            return true
          } catch (error) {
            throw new ErrorWithMessage({ message: (error as Error).message, status: httpStatusCode.UNAUTHORIZED })
          }
        }
      }
    }
  })
)
const forgotPasswordValidator = validateSchema(
  checkSchema({
    email: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.forgot_password.email.required
      },
      isEmail: {
        errorMessage: messages.errors.forgot_password.email.invalid
      },
      custom: {
        options: async (value, { req }) => {
          const user = await userService.findExistedEmail(value)
          if (!user) {
            throw new ErrorWithMessage({ message: messages.errors.forgot_password.email.not_found, status: 404 })
          }
          ;(req as Request).user = user
          return true
        }
      }
    }
  })
)
const resetPasswordValidator = validateSchema(
  checkSchema({
    // token: {
    //   in: ['query'],
    //   notEmpty: {
    //     errorMessage: messages.errors.unauthorized.reset_password.token_required
    //   },
    //   custom: {
    //     options: async (value, { req }) => {
    //       try {
    //         const decoded_token = await JwtModule.verifyForgotPasswordToken(value)
    //         ;(req as Request).decoded_forgot_password_token = decoded_token
    //         return true
    //       } catch (error) {
    //         throw new ErrorWithMessage({ message: (error as Error).message, status: httpStatusCode.UNAUTHORIZED })
    //       }
    //     }
    //   }
    // },
    password: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.register.password.required
      },
      isLength: {
        errorMessage: messages.errors.register.password.min,
        options: { min: 6, max: 150 }
      }
    },
    confirm_password: {
      in: ['body'],
      optional: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(messages.errors.register.confirm_password.not_match)
          } else return true
        }
      }
    }
  })
)
const changePasswordValidator = validateSchema(
  checkSchema({
    old_password: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.change_password.old_password.required
      },
      isLength: {
        errorMessage: messages.errors.change_password.old_password.min,
        options: { min: 6, max: 150 }
      },
      custom: {
        options: async (value, { req }) => {
          const { user_id } = (req as Request).decoded_access_token as TokenPayload
          const user = await userService.findUserById(user_id)
          if (user) {
            const password = hashPassword(value)
            if (password !== user.password) {
              throw new Error(messages.errors.change_password.old_password.invalid)
            }
          }
          return true
        }
      }
    },
    new_password: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.change_password.new_password.required
      },
      isLength: {
        errorMessage: messages.errors.change_password.new_password.min,
        options: { min: 6, max: 150 }
      }
    }
  })
)
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const user = await userService.findUserById(user_id)
  if (!user) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Không tìm thấy người dùng' })
  }
  if (user.role !== ROLE_TYPE.ADMIN) {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: messages.errors.unauthorized.admin_required })
  }
  next()
}
const isVipUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.decoded_access_token as TokenPayload
    const user = await userService.findUserById(user_id)
    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Không tìm thấy người dùng' })
    }
    const vip_user_detail = await vipUserDetailsService.getVipUserByUserId(user_id)
    if (!vip_user_detail) {
      throw new ErrorWithMessage({
        message: 'Bạn không phải là người dùng VIP',
        status: httpStatusCode.FORBIDDEN
      })
    }
    next()
  } catch (error) {
    responseError(res, error)
  }
}
const commonMiddlewares = {
  registerBodyValidator,
  loginBodyValidator,
  accessTokenValidator,
  refreshTokenValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  changePasswordValidator,
  resetPasswordValidator,
  isAdmin,
  isVipUser
}
export default commonMiddlewares
