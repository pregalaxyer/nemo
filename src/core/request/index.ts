import { Options } from './index.d'
import * as queryString from 'query-string'
/**
 * @description default request
 * @TODO: cookies auth functions
 */
async function request({
  url,
  method,
  body,
  query,
  formData,
  signal
}: Options) {
  const res = await fetch(getUrl(url, query), {
    method: method || 'get',
    body: body || formData || null,
    signal
  })
  return res
}

function getUrl(url: string, query: Options['query']) {
  return url + '?' + queryString.stringify(query)
}
export default request