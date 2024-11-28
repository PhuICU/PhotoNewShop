import { checkSchema } from 'express-validator'
import messages from '~/constants/message'
import validateSchema from '~/utils/validation'

const createPropertyValidator = validateSchema(
  checkSchema({
    name: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.properties.name.required
      }
    },
    description: {
      in: ['body'],
      notEmpty: {
        errorMessage: messages.errors.properties.description.required
      }
    }
  })
)
const propertiesMiddlewares = {
  createPropertyValidator
}
export default propertiesMiddlewares
