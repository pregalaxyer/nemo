
import { TypeItem } from '../interfaces/index.d'
export interface ServiceController {
  name: string
  description: string
  imports: string[]
  requests: BaseRequest[]
}



export interface BaseRequest {
  name: string
  description: string
  responseType?: string
  parameters?: TypeItem[]
  query?: TypeItem[]
  body?: TypeItem[]
  formData?: TypeItem[]
  url: string
  header?: TypeItem[]
}
