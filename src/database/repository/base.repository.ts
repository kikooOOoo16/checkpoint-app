import {Collection, Db, MongoClient} from 'mongodb';

export abstract class BaseRepository<T> {
  protected collection: Collection<T>;
  private static client: MongoClient;
  private static db: Db;
  private static connectPromise?: Promise<Db>;

  constructor(protected collectionName: string) {}

  protected async getCollection(): Promise<Collection<T>> {
    if (this.collection) {
      return this.collection;
    }

    if (!BaseRepository.db) {
      if (BaseRepository.connectPromise === undefined) {
        BaseRepository.connectPromise = (async () => {
          const url = process.env.MONGODB_URL;
          if (!url) {
            throw new Error('MONGODB_URL environment variable is not set');
          }
          BaseRepository.client = new MongoClient(url);
          await BaseRepository.client.connect();
          BaseRepository.db = BaseRepository.client.db(process.env.MONGODB_DB_NAME);
          return BaseRepository.db;
        })();
      }
      await BaseRepository.connectPromise;
    }

    this.collection = BaseRepository.db.collection<T>(this.collectionName);
    return this.collection;
  }

  async create(data: T): Promise<void> {
    const collection = await this.getCollection();
    await collection.insertOne(data as any);
  }

  async update(query: any, data: Partial<T>): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne(query, {$set: data});
  }

  async findOne(query: any): Promise<T | null> {
    const collection = await this.getCollection();
    return collection.findOne(query) as Promise<T | null>;
  }

  async findAll(): Promise<T[]> {
    const collection = await this.getCollection();
    return collection.find().toArray() as Promise<T[]>;
  }
}
