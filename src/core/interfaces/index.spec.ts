import { Definition } from '../types'
import {convertDefinitionProperty, formatArrayTypes, formatStringEnums, formatTypes, convertModels, formatRefsLink, propertyGetter } from './index'

describe('illegal words should replace by _', () => {
  // case A: ResponseDto«List«HomeLocationInfoResponse»»
  // case B: ResponseDto«Map«int,CustomerBudgetInfoResponse»
  // case C: ResponseDto«Map«string,Map«string,string»»»
  test('ResponseDto«List«HomeLocationInfoResponse»» should rewrite', () => {
      expect(
        convertDefinitionProperty('ResponseDto«List«HomeLocationInfoResponse»»')
      ).toEqual('ResponseDto_List_HomeLocationInfoResponse')
    })
  test('ResponseDto«Map«int,CustomerBudgetInfoResponse» should rewrite', () => {
      expect(
        convertDefinitionProperty('ResponseDto«Map«int,CustomerBudgetInfoResponse»')
      ).toEqual('ResponseDto_Map_int_CustomerBudgetInfoResponse')
    })
  test('ResponseDto«Map«string,Map«string,string»»» should rewrite', () => {
      expect(
        convertDefinitionProperty('ResponseDto«Map«string,Map«string,string»»»')
      ).toEqual('ResponseDto_Map_string_Map_string_string')
    })
})

// test enum format
describe('string enum format to string types', () => {
  it('string enum qutar', () => {
    expect(
      formatStringEnums(['Q1','Q2','Q3','Q4'])
    ).toBe("'Q1' | 'Q2' | 'Q3' | 'Q4'")
  })
})

// formatArrayTypes configs
const formatArrayTypesCase = [
  [
    {
      "type": "array",
      "description": "list",
      "items": {
        "$ref": "#/definitions/Node"
      }
    },
    {
      type: 'Array<Node>',
      model: ['Node'],
      description: "list",
    }
  ],
  [
    {
      "type": "array",
      "description": "list",
      "items": {
        "type": "integer",
        "format": "init32"
      }
    },
    {
      type: 'Array<number>',
      model: [],
      description: "list",
    }
  ],
  [
    {
      "type": "array",
      "description": "quarter",
      "items": {
        "type": "string",
        "enum": [
          "Q1",
          "Q2",
          "Q3",
          "Q4",
        ]
      }
    },
    {
      type: "Array<'Q1' | 'Q2' | 'Q3' | 'Q4'>",
      model: [],
      description: "quarter",
    }
  ],

]


describe.each(
  formatArrayTypesCase
)('.formatArrayTypes',
// @ts-ignore
(typeItem, expected) => {
  test(` format as array types`, () => {
    expect(
      formatArrayTypes(typeItem as Definition)
    ).toMatchObject(expected)
  })
})

const convertModelsCases = [
  [
    'Node',
    {
      "Node": {
        "type": "object",
        "properties": {

          "name": {
            "type": "string",
            "description": "name"
          },
          "id": {
            "type": "integer",
            "format": "int64",
            "description": "ID"
          },
          "user": {
            $ref: '#/definitions/user',
            description: 'user'
          },
          "quarter": {
            "type": "array",
            "description": "quarter",
            "items": {
              "type": "string"
            }
          },
        },
        "title": "Node",
        "description": "node"
        },
    },
    {
      name: 'Node',
      imports: ["user"],
      "description": "node",
      types: expect.any(Array),

    }
  ]
]

describe.each(
  convertModelsCases
)('.convertModels', (a, b, c) => {
  test(`convertModels ${a} should return something likes`, () => {
    // @ts-ignore
    expect(convertModels(b)).toContainEqual(c)
  })
})


it('formatRefsLink test', () => {
  expect(formatRefsLink('#/definitions/typename')).toBe('typename')
})

describe('formatTypes unit tests', () => {
  it('with ref', () => {
    const refObject = {
      $ref: '#/definitions/typename',
      description: 'ref typename test'
    }
    expect(formatTypes(refObject)).toHaveProperty('type', 'typename')
  })

  it('number test', () => {
    const numberObject = {
      type: 'number',
      description: 'number object'
    }
    expect(formatTypes(numberObject)).toHaveProperty('type', 'number')
  })
  it('boolean test', () => {
    const booleanObject = {
      type: 'boolean',
      description: 'boolean object'
    }
    expect(formatTypes(booleanObject)).toHaveProperty('type', 'boolean')
  })


})

it('propertyGetter', () => {
  expect(propertyGetter('first-name')).toBe("'first-name'")
  expect(propertyGetter('firstName')).toBe('firstName')
})
