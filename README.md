# Expresso Validator

> JSON Schema validation middleware for [Expresso](https://github.com/expresso)

## Summary

- [Expresso Validator](#expresso-validator)
  - [Summary](#summary)
  - [What is this](#what-is-this)
  - [Basic Usage](#basic-usage)
    - [Validating queries](#validating-queries)
  - [Errors](#errors)

## What is this

This middleware validates an input against a [JSON Schema](https://json-schema.org) and automatically throws a boom error for `badData` (which is HTTP code `422 - Unprocessable Entity`) if this input is not matched.

## Basic Usage

**Install**:

```sh
$ npm i @expresso/validator
```

**Import and use**:

```ts
import { validate } from '@expresso/validator'

// Your expresso initialization here

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'integer'
    }
  },
  additionalProperties: false,
  required: ['name', 'age']
}

app.post('/users', validate(schema), (req: Reques, res: Response, next: NextFunction) => { // ... // })
```

### Validating queries

By default, the validator will match the schema against the body of the request, this is why the root type is `{ type: 'object' }`. It is also possible to validate the query string params:

```ts
import { validate } from '@expresso/validator'

// Your expresso initialization here

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'integer'
    }
  },
  required: ['name', 'age']
}

app.get('/users', validate.query(schema), (req: Reques, res: Response, next: NextFunction) => { // ... // })
```

This will validate the whole query string against the given schema.

## Errors

This validator follows Expresso's directives and returns a [Boom](https://github.com/hapijs/boom) error for BadData, right now it is not possible to change this behavior