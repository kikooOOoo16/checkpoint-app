import 'dotenv/config';
import {MongoClient} from 'mongodb';

async function migrate() {
  const url = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!url) {
    console.error('Error: MONGODB_URL environment variable is not set.');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB at: ${url}`);
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const actualDbName = db.databaseName;
    console.log(`Using database: ${actualDbName}`);

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    const neededCollections = ['visitors', 'workers'];

    for (const name of neededCollections) {
      if (!collectionNames.includes(name)) {
        await db.createCollection(name);
        console.log(`Collection '${name}' created.`);
      } else {
        console.log(`Collection '${name}' already exists.`);
      }
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
