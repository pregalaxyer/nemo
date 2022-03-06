export interface Model {
  name: string
  imports: string[]
  types: TypeItem[]
  description: string
  extends?: string
  useType?: boolean
}

export interface TypeItem {
  name?: string
  type: string
  description: string
  isOption?: boolean
  imports?: string[]
  alias?: string // when name is illegal variable

}
