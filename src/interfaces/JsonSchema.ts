import { Without } from '../types/without'

/**
 * @description All the values a string format can have
 */
type StringBuiltInFormats = 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex'

/**
 * @description Base for all other types
 */
export interface PrimitiveType<U> {
  type?: U
}

/**
 * @description Properties that should be at the root level of the schema
 */
export interface RootSchema {
  $schema?: string
  $ref?: string
  definitions?: string
}

/**
 * @description Properties which are in all types
 */
export interface GenericType extends CombinationOperators<JSONSchema> {
  title?: string
  description?: string
  default?: any
  examples?: Array<any>
  const?: any
  contentEncoding?: string
  contentMediaType?: string
  enum?: (number | string | Object | Array<any> | boolean | null)[]
}

/**
 * @description Schema combination operators
 */
export interface CombinationOperators<T> {
  oneOf?: Array<Partial<T>>
  not?: Partial<T>
  anyOf?: Array<Partial<T>>
  allOf?: Array<Partial<T>>
}

/**
 * @description Properties for an object type
 */
export interface ObjectPropertyPart {
  [propertyName: string]: JSONSchema
}

/**
 * @description Object type
 */
export interface ObjectSchema extends GenericType, PrimitiveType<'object'> {
  required?: string[]
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

/**
 * @description Number schemas for integer and number
 */
export interface BaseNumberSchema<U> extends GenericType, PrimitiveType<U> {
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  minimum?: number
  maximum?: number
}

/**
 * @description String type
 */
export interface StringSchema extends GenericType, PrimitiveType<'string'> {
  minLength?: number
  maxLength?: number
  pattern?: string
  format?: StringBuiltInFormats
  enum?: string[]
}

/**
 * @description ArraySchema
 */
export interface ArraySchema extends GenericType, PrimitiveType<'array'> {
  items?: JSONSchema | JSONSchema[]
  contains?: JSONSchema
  additionalItems?: boolean | JSONSchema
  maxItems?: number
  minItems?: number
  uniqueness?: boolean
}

export type JSONSchema = (ObjectSchema | BaseNumberSchema<'integer'> | BaseNumberSchema<'number'> | StringSchema | PrimitiveType<'boolean'> | ArraySchema | PrimitiveType<'null'>) & RootSchema
