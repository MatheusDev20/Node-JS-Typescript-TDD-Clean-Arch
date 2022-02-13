export class ServerError extends Error {
  constructor(stack: string | undefined) {
    super('An Error ocurred')
    this.name = 'Server Error'
    this.stack = stack
  }
}
