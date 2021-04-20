import { Options } from './index.d'
import * as queryString from 'query-string'

/**
 * @description default request
 * @TODO: cookies auth functions
 */
async function request(options: Options) {
  const res = await fetch(
    getUrl(options.url, options.query), 
    {
      method: options.method || 'get',
      body: getRequestBody(options),
      headers: getHeaders(options),
      signal: options.signal
    }
  )
  return res
}

function getUrl(url: string, query: Options['query']) {
  return url + '?' + queryString.stringify(query)
}

function isString(value: any): value is String {
  return typeof value === 'string'
}

function isBlob(value: any): value is Blob {
  return value instanceof Blob
}

function getHeaders(options:Options ): Headers {
  const headers = new Headers({
    Accept: 'application/json',
    ...options.headers
  })
  if (options.body) {
    if (isBlob(options.body)) {
      headers.append('Content-Type', 'application/octet-stream')
    } else if (isString(options.body)) {
      headers.append('Content-Type', 'text/plain')
    } else {
      headers.append('Content-Type', 'application/json')
    }
  }
  return headers
}

function getFormData(data: Record<string, any>): FormData {
  let formData = new FormData()
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  return formData
}


function getRequestBody(options: Options): BodyInit {
  if (options.body) {
    return isBlob(options.body) || isBlob(options.body) ? options.body : JSON.stringify(options.body)
  }
  if (options.formData) {
    return getFormData(options.formData)
  }
  return undefined
}


export default request