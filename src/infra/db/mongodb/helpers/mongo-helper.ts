import { Collection, Db, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  db: null as unknown as Db,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
    this.db = this.client.db()
  },

  async closeConnection(): Promise<void> {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.db.collection(name)
  }
}
