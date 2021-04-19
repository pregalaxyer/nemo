import { Method } from '../types/index.d'

export interface Options {
  url: string
  method?: Method
  body?: RequestInit['body']
  formData?: FormData
  query?: Record<string, any>
  signal?: AbortSignal
}