import { Insertable, Selectable, Updateable } from 'kysely';
import { db } from '../db/database';
import { Users } from '../db/types';

export async function findUserById(id: number) {
  return await db.selectFrom('users').where('id', '=', id).selectAll().executeTakeFirst();
}

export async function findUsers(criteria: Partial<Selectable<Users>>) {
  let query = db.selectFrom('users');

  if (criteria.id) {
    query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.name) {
    query = query.where('name', 'ilike', criteria.name);
  }

  return await query.selectAll().execute();
}

export async function updateUser(id: number, updateWith: Updateable<Users>) {
  await db.updateTable('users').set(updateWith).where('id', '=', id).execute();
}

export async function createUser(user: Insertable<Users>) {
  return db.insertInto('users').values(user).returningAll().executeTakeFirstOrThrow();
}
