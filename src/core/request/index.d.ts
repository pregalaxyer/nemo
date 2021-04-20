import { Method } from '../types/index.d'

export interface Options {
  url: string
  method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH'
  body?: Record<string, any>
  formData?: Record<string, any>
  query?: Record<string, any>
  signal?: AbortSignal
  headers?: HeadersInit
  responseHeader?: string
}