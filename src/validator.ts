import { badData } from '@hapi/boom'
import { Definition, PartialArgs } from 'typescript-json-schema'
import { JSONSchema } from './interfaces/JsonSchema'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import Ajv, { ErrorObject, DependenciesParams, ValidateFunction } from 'ajv'

const REASON_REQUIRED = 'required'
const REASON_REQUIRED_MESSAGE = 'is required'

type ValidateOptions = { coerce?: boolean, defaults?: boolean, property?: string }

type ReadableError = {
  path: string
  message: string
  reason: string
}

type Nullable<T> = T | null | undefined

type ExtendedRequest = Request & {
  [k: string]: any
}

function humanReadableErrors (errors: Nullable<ErrorObject[]>): Nullable<ReadableError[]> {
  if (!errors) return null

  return errors.map((error) => {
    const { dataPath, message, keyword: reason } = error
    const missingProperty = (error.params as DependenciesParams).missingProperty

    const path = ((reason === REASON_REQUIRED) ? `${dataPath}.${missingProperty}` : dataPath).replace(/^\./, '')
    const text = ((reason === REASON_REQUIRED) ? REASON_REQUIRED_MESSAGE : (message as string).replace('should', 'must').replace(/"/g, '`'))

    return { path, message: `'${path}' ${text}`, reason }
  })
}

const defaultOptions: ValidateOptions = {
  coerce: true,
  defaults: true,
  property: 'body'
}

function factory (schema: JSONSchema | Definition, options?: ValidateOptions): RequestHandler {
  const { coerce, defaults, property } = { ...defaultOptions, ...options }
  const ajv = new Ajv({
    coerceTypes: coerce,
    useDefaults: defaults,
    allErrors: true
  })

  const compile = Promise.resolve(() => ajv.compile(schema))

  return (req: ExtendedRequest, _res: Response, next: NextFunction) => {
    const validateBody = (validate: ValidateFunction) => {
      if (validate(req[property as string] || {})) return next()

      const errors = humanReadableErrors(validate.errors)
      const message = (errors as ReadableError[]).map(error => error.message).join('.')

      next(badData(message, errors))
    }

    compile.then(validateFunction => validateFunction())
      .then(validateBody)
      .catch(next)
  }
}

export function validateType <_T> (_schema?: PartialArgs, _validator?: ValidateOptions): RequestHandler {
  return factory(_schema as any, _validator)
}

factory.body = (schema: JSONSchema | Definition, options: ValidateOptions = {}) => factory(schema, { ...options, property: 'body' })
factory.query = (schema: JSONSchema | Definition, options: ValidateOptions = {}) => factory(schema, { ...options, property: 'query' })

export { factory as validate }
