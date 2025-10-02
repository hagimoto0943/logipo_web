import queryString from 'query-string';

export default class Base {

  constructor({apiPrefix, defaultHeaders={}}) {
    this.apiPrefix = apiPrefix ? apiPrefix : import.meta.env.PUBLIC_API_URL
    this.defaultHeaders = defaultHeaders
  }

  async fetch(path, options={}) {
    let url = `${this.apiPrefix}${path}`
    let { body } = options
    const { params, ...rest } = options

    if (params) {
      const qs = queryString.stringify( params, { arrayFormat: 'bracket' } )
      url += `?${qs}`
    }

    const headers = { ...this.defaultHeaders, ...(options.headers || {}) }

    if ( body && typeof body === 'object' && !(body instanceof FormData)) {
      body = JSON.stringify(body)
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(url,{
      credentials: 'include',
      ...rest,
      headers,
      body,
    })

    const isJson = response.headers?.get('content-type')?.includes('application/json')

    if (!response.ok) {
      let message = `${response.status} ${response.statusText}`
      if (isJson) {
        try {
          const errorPayload = await response.json()
          message = errorPayload?.message || message
        } catch (_) {
          // ignore parse errors and fallback to default message
        }
      }

      const error = new Error(message)
      error.status = response.status
      throw error
    }

    if (response.status === 204) return null

    if (isJson) {
      return response.json()
    }

    return response.text()
  }
}
