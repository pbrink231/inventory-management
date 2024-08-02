import { Insertable, Selectable, Updateable } from 'kysely';
import { db } from '../db/database';
import { Locations } from '../db/types';

export async function findLocationById(id: number) {
  return await db.selectFrom('locations').where('id', '=', id).selectAll().executeTakeFirst();
}

export async function findLocations(criteria: Partial<Selectable<Locations>>) {
  let query = db.selectFrom('locations');

  if (criteria.id) {
    query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.name) {
    query = query.where('name', 'ilike', criteria.name);
  }

  return await query.selectAll().execute();
}

export async function updateLocation(id: number, updateWith: Updateable<Locations>) {
  await db.updateTable('locations').set(updateWith).where('id', '=', id).execute();
}

export async function createLocation(location: Insertable<Locations>) {
  return await db.insertInto('locations').values(location).returningAll().executeTakeFirstOrThrow();
}
