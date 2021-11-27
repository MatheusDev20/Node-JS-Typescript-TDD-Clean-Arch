import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect('mongodb://127.0.0.1:41399/')
  },
  async closeConnection() {
    await this.client.close()
  }
}
