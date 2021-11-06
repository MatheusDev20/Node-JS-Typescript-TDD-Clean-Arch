export class ServerError extends Error {
  constructor() {
    super('An Error ocurred')
    this.name = 'Server Error'
  }
}
