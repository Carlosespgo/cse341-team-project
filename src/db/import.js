import { closeDb, connectToDb } from './connect.js';
import { initializeDatabase } from './initialize.js';
import Role from '../models/schemas/roles.js';

try {
  const db = await connectToDb();
  const rolesOnly = process.argv.includes('--roles-only');
  if (!rolesOnly) {
    await initializeDatabase(db);
  }
  for (const name of ['customer', 'admin']) {
    await Role.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true }
    );
  }
  console.log('Roles disponibles:', await Role.distinct('name'));
  console.log('MongoDB import complete.');
} finally {
  await closeDb();
}
