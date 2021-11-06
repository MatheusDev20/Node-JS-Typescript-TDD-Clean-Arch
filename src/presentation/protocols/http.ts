
export interface SignUpBodyRequest {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
export interface HttpResponse {
  statusCode: number
  body: any
}

export interface HttpRequest {
  body?: any
}
