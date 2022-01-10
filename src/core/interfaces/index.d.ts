export interface Model {
  name: string
  imports: string[]
  types: TypeItem[]
  description: string
  extends?: string
}

export interface TypeItem {
  name: string
  type: string
  description: string
  isOption?: boolean
  imports?: string[]
}
