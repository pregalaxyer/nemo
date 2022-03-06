import { Definition } from '../types'
import {
  convertDefinitionProperty,
  formatArrayTypes,
  formatStringEnums,
  formatTypes,
  convertModels,
  formatRefsLink,
  propertyGetter,
  allOfHandler,
  objectHandler,
  transformTitle,
  getMapPrefix,
} from './index'
import { Model } from './index.d'

describe('illegal words should replace by _', () => {
  // case A: List«InfoResponse»
  // case B: Map«int,InfoResponse
  // case C: Map«string,Map«string,string»»
  test('List«InfoResponse»» should rewrite', () => {
    expect(
      convertDefinitionProperty('List«InfoResponse»')
    ).toEqual('List_InfoResponse')
  })
  test('Map«int,InfoResponse» should rewrite', () => {
    expect(
      convertDefinitionProperty(
        'Map«int,InfoResponse»'
      )
    ).toEqual('Map_int_InfoResponse')
  })
  test('Map«string,Map«string,string»»» should rewrite', () => {
    expect(
      convertDefinitionProperty('Map«string,Map«string,string»»')
    ).toEqual('Map_string_Map_string_string')
  })
})

// test enum format
describe('string enum format to string types', () => {
  test('string enum quarter', () => {
    expect(formatStringEnums(['Q1', 'Q2', 'Q3', 'Q4'])).toBe(
      "'Q1' | 'Q2' | 'Q3' | 'Q4'"
    )
  })
})

// formatArrayTypes configs
const formatArrayTypesCase = [
  [
    {
      type: 'array',
      description: 'list',
      items: {
        $ref: '#/definitions/Node',
      },
    },
    {
      type: 'Array<Node>',
      model: ['Node'],
      description: 'list',
    },
  ],
  [
    {
      type: 'array',
      description: 'list',
      items: {
        type: 'integer',
        format: 'init32',
      },
    },
    {
      type: 'Array<number>',
      model: [],
      description: 'list',
    },
  ],
  [
    {
      type: 'array',
      description: 'quarter',
      items: {
        type: 'string',
        enum: ['Q1', 'Q2', 'Q3', 'Q4'],
      },
    },
    {
      type: "Array<'Q1' | 'Q2' | 'Q3' | 'Q4'>",
      model: [],
      description: 'quarter',
    },
  ],
]

describe.each(formatArrayTypesCase)(
  '.formatArrayTypes',
  // @ts-ignore
  (typeItem, expected) => {
    test(` format as array types`, () => {
      expect(formatArrayTypes(typeItem as Definition)).toMatchObject(expected)
    })
  }
)

const convertModelsCase: Record<string, Definition> = {
  Node: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'name',
      },
      id: {
        type: 'integer',
        format: 'int64',
        description: 'ID',
      },
      user: {
        $ref: '#/definitions/User',
        description: 'user',
      },
      quarter: {
        type: 'array',
        description: 'quarter',
        items: {
          type: 'string',
        },
      },
    },
    title: 'Node',
    description: 'node',
  },
}
const allOfCase = {
  title: 'allOfCase',
  allOf: [
    {
      $ref: '#/definitions/User',
    },
    convertModelsCase['Node'],
  ],
}

const mapCase = {
  'Map«string,string»»': {
    type: 'object',
    title: 'Map«string,string»»',
    additionalProperties: {
      $ref: '#/definitions/Map',
    },
  },
  'Map«int,string»»': {
    type: "object",
    title: "Map«int,string»",
    additionalProperties: {
      type: "string"
    }
  },
  'Res«Map«string,User»»': {
    type: 'object',
    properties: {
      code: {
        type: 'number',
        description: 'response code'
      },
      data: {
        type: 'object',
        additionalProperties: {
          $ref: '#/definitions/User'
        }
      }
    }
  }
}

describe('convertModels', () => {
  test(`convertModel result check`, () => {
    // @ts-ignore
    const res = convertModels({
      ...convertModelsCase,
      allOfCase,
    })
    expect(res[0].types).toHaveLength(4)
    expect(res[0].imports).toHaveLength(1)
    expect(res[1].imports).toHaveLength(1)
    expect(res[1].extends).toBeDefined()
    // @ts-ignore
    const mapModels = convertModels(mapCase)
    expect(mapModels[0].types).toHaveLength(1)
    expect(mapModels[1].types).toHaveLength(1)
    expect(mapModels[2].imports).toHaveLength(1)
  })
})

it('formatRefsLink test', () => {
  expect(formatRefsLink('#/definitions/typename')).toBe('typename')
})

describe('formatTypes unit tests', () => {
  test('with ref', () => {
    const refObject = {
      $ref: '#/definitions/typename',
      description: 'ref typename test',
    }
    expect(formatTypes(refObject)).toHaveProperty('type', 'typename')
  })

  test('number test', () => {
    const numberObject = {
      type: 'number',
      description: 'number object',
    }
    expect(formatTypes(numberObject)).toHaveProperty('type', 'number')
  })
  test('boolean test', () => {
    const booleanObject = {
      type: 'boolean',
      description: 'boolean object',
    }
    expect(formatTypes(booleanObject)).toHaveProperty('type', 'boolean')
  })
  test('map ref test', () => {
    const mapTestSchemaWithMap = {
      type: 'object',
      title: 'Map«string,Map«string,string»»',
      additionalProperties: {
        $ref: '#/definitions/Map',
      },
    }

    const mapType = formatTypes(
      // @ts-ignore
      mapTestSchemaWithMap,
      mapTestSchemaWithMap.title.split(',')
    ).type
    expect(mapType).toBe('Record<string, Record<string, string>>')
  })

  test('base map test', () => {
    const mapTestSchema = {
      type: 'object',
      title: 'Map«string,string»',
      additionalProperties: {
        type: 'string',
      },
    }
    const baseType = formatTypes(
      // @ts-ignore
      mapTestSchema,
      mapTestSchema.title.split(',')
    ).type
    expect(baseType).toBe('Record<string, string>')
  })

  test('nest map test', () => {
    const mapTestSchemaInner = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'string',
        },
      },
    }
    const nestType = formatTypes(
      // @ts-ignore
      mapTestSchemaInner,
      'Map«string,Map«string,string»»'.split(',')
    ).type
    expect(nestType).toBe('Record<string, Record<string, string>>')
  })
})

it('propertyGetter', () => {
  expect(propertyGetter('first-name')).toBe("'first-name'")
  expect(propertyGetter('firstName')).toBe('firstName')
})

describe('handlers test here', () => {
  test('object handler', () => {
    const objectModel = {
      name: '',
      description: '',
      types: [],
      imports: [],
    }
    objectHandler(convertModelsCase['Node'], objectModel, 'Node')
    expect(objectModel.imports).toHaveLength(1)
    expect(objectModel.types).toHaveLength(4)
  })

  test('allOf handler', () => {
    const allOfModel: Model = {
      name: '',
      description: '',
      types: [],
      imports: [],
      extends: undefined,
    }
    allOfHandler(allOfCase, allOfModel, 'Node')
    expect(allOfModel.extends).toBe('User')
    expect(allOfModel.types).toHaveLength(4)
  })
})

it('transform title test', () => {
  expect(transformTitle('Map«string,string»')).toBe('Record<string, string>')
})

it('get map prefix', () => {
  expect(getMapPrefix('')).toBe('')
  expect(getMapPrefix('Map«string')).toBe('Record<string, ')
  expect(getMapPrefix('Map«int')).toBe('Record<number, ')
})
