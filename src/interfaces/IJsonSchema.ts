import { Without } from '../types/without'

interface GenericType {
  title?: string
  description?: string
  default?: any
  examples?: Array<any>
  const?: any
}

interface ObjectSchema extends GenericType {
  type: 'object'
  required?: Array<keyof ObjectPropertyPart>
  additionalProperties?: boolean | JSONSchema
  properties?: ObjectPropertyPart
  propertyNames?: {
    pattern: string
  }
  minProperties?: number
  maxProperties?: number
  dependencies?: {
    [dependentProperty in keyof ObjectPropertyPart]: Array<Without<keyof ObjectPropertyPart, dependentProperty>>
  }
  patternProperties?: {
    [patternRegex: string]: JSONSchema
  }
}

interface BaseNumberSchema<U> extends GenericType {
  type: U
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  minimum?: number
  maximum?: number
}

interface StringSchema extends GenericType {
  type: 'string'
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: StringBuiltInFormats
  enum?: string[]
}

interface ArraySchema extends GenericType {
  type: 'array'
  items?: JSONSchema | JSONSchema[]
  contains?: JSONSchema
  additionalItems?: boolean | JSONSchema
  maxItems?: number
  minItems?: number
  uniqueness?: boolean
}

interface PrimitiveType<U> {
  type: U
}

interface ObjectPropertyPart {
  [propertyName: string]: JSONSchema
}

// type JSONSchemaTypes = 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'null'
type StringBuiltInFormats = 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex'

export type JSONSchema = ObjectSchema | BaseNumberSchema<'integer'> | BaseNumberSchema<'number'> | StringSchema | PrimitiveType<'boolean'> | ArraySchema | PrimitiveType<'null'>
