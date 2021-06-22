import { Definition } from '../types'
import {convertDefinitionProperty, formatArrayTypes, formatStringEnums, formatTypes, convertModels } from './index'

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
      "description": "节点目标详情集合",
      "items": {
        "$ref": "#/definitions/NodeTargetDetailDto"
      }
    },
    {
      type: 'Array<NodeTargetDetailDto>',
      model: ['NodeTargetDetailDto'],
      description: "节点目标详情集合",
    }
  ],
  [
    {
      "type": "array",
      "description": "idsList集合",
      "items": {
        "type": "integer",
        "format": "init32"
      }
    },
    {
      type: 'Array<number>',
      model: [],
      description: "idsList集合",
    }
  ],
  [
    {
      "type": "array",
      "description": "财季下拉框",
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
      description: "财季下拉框",
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
    'NodeTargetDetailDto',
    {
      "NodeTargetDetailDto": {
        "type": "object",
        "properties": {
          "apartValue": {
            "type": "number",
            "description": "设置值"
          },
          "bossName": {
            "type": "string",
            "description": "负责人名称"
          },
          "businessId": {
            "type": "integer",
            "format": "int64",
            "description": "业务ID"
          },
          "sale": {
            $ref: '#/definitions/SaleInfo',
            description: '销售信息'
          },
          "setQuarter": {
            "type": "array",
            "description": "设置季度集合",
            "items": {
              "type": "string"
            }
          },
        },
        "title": "NodeTargetDetailDto",
        "description": "节点目标详情数据"
        },
    },
    {
      name: 'NodeTargetDetailDto',
      imports: ["SaleInfo"],
      "description": "节点目标详情数据",
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

