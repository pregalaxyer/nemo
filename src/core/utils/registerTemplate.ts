import index from '../../templates/index.mustache'
import model from '../../templates/model.mustache'
import request from '../../templates/request.mustache'
import service from '../../templates/service.mustache'
import utils from '../../templates/utils.mustache'

export interface Templates {
  index: string
  model: string
  request: string
  service: string
  utils: string
}
export function decodeBase64(base64String: string): string {
  if (typeof base64String !== 'string') return ''
  const buffer = Buffer.from(base64String, 'base64')
  return buffer.toString('utf-8')
}

export function registerTemplates(): Templates {
  return {
    index: decodeBase64(index),
    model: decodeBase64(model),
    request: decodeBase64(request),
    service: decodeBase64(service),
    utils: decodeBase64(utils),
  }
}