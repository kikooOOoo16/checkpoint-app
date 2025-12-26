import 'dotenv/config';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
import * as readline from 'readline';
import {AccountRole} from '../src/model/enums/account-roles.enum';
import {Worker} from '../src/database/model';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

const validateEmail = (email: string): string | null => {
  if (email.length < 5) {
    return 'Email must be at least 5 characters long.';
  }
  if (email.length > 254) {
    return 'Email must not exceed 254 characters.';
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Email must be a valid email address (e.g., user@example.com).';
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (password.length > 128) {
    return 'Password must not exceed 128 characters.';
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
  }
  return null;
};

async function createAdmin() {
  const url = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!url) {
    console.error('Error: MONGODB_URL environment variable is not set.');
    process.exit(1);
  }

  console.log('--- Create Admin User ---');

  let email = '';
  let isEmailValid = false;
  while (!isEmailValid) {
    email = await question('Enter Admin Email: ');
    const error = validateEmail(email);
    if (!error) {
      isEmailValid = true;
    } else {
      console.error(`Error: ${error}`);
    }
  }

  let password = '';
  let isPasswordValid = false;
  while (!isPasswordValid) {
    password = await question('Enter Admin Password: ');
    const error = validatePassword(password);
    if (!error) {
      isPasswordValid = true;
    } else {
      console.error(`Error: ${error}`);
    }
  }

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const workers = db.collection<Worker>('workers');

    const adminExists = await workers.findOne({email});

    if (adminExists) {
      console.error(`Error: User with email ${email} already exists.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await workers.insertOne({
      email,
      password: hashedPassword,
      role: AccountRole.ADMIN
    });

    console.log(`\nAdmin user ${email} created successfully.`);
  } catch (err) {
    console.error('\nFailed to create admin:', err);
  } finally {
    await client.close();
    rl.close();
  }
}

createAdmin();
