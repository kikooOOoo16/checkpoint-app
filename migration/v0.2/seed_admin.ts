import 'dotenv/config';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
import {AccountRole} from '../../src/model/enums/account-roles.enum';

async function seed() {
  const url = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!url) {
    console.error('Error: MONGODB_URL environment variable is not set.');
    process.exit(1);
  }

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const workers = db.collection('workers');

    const adminEmail = 'admin@checkpoint.com';
    const adminExists = await workers.findOne({email: adminEmail});

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await workers.insertOne({
        email: adminEmail,
        password: hashedPassword,
        role: AccountRole.ADMIN,
        lastLogin: null
      } as any);
      console.log(`Admin user created: ${adminEmail} / admin123`);
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
