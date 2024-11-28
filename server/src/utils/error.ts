import httpStatusCode from '~/constants/httpStatusCode'
import messages from '~/constants/message'
type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}
//
export class ErrorWithMessage extends ErrorWithStatus {
  constructor({ message, status }: { message: string; status: number }) {
    super({ message, status })
  }
}
export class UnauthorizedError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = messages.errors.unauthorized.default, errors }: { message?: string; errors: any }) {
    super({ message, status: httpStatusCode.UNAUTHORIZED })
    this.errors = errors
  }
}
export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = messages.errors.unProcessableEntity, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: httpStatusCode.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
