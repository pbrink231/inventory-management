import { Insertable, Selectable, Updateable } from 'kysely';
import { db } from '../db/database';
import { Companies, Users } from '../db/types';

export async function findCompanyById(id: number) {
  return await db.selectFrom('companies').where('id', '=', id).selectAll().executeTakeFirst();
}

export async function findCompanies(criteria: Partial<Selectable<Companies>>) {
  let query = db.selectFrom('companies');

  if (criteria.id) {
    query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.name) {
    query = query.where('name', 'ilike', criteria.name);
  }

  return await query.selectAll().execute();
}

export async function updateCompany(id: number, updateWith: Updateable<Companies>) {
  await db.updateTable('companies').set(updateWith).where('id', '=', id).execute();
}

export async function createCompany(user: Selectable<Users>, company: Insertable<Companies>) {
  // use transaction to ensure that both inserts are successful

  try {
    return db.transaction().execute(async (trx) => {
      const newCompany = await trx
        .insertInto('companies')
        .values(company)
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('user_companies')
        .values({
          user_id: user.id,
          company_id: newCompany.id
        })
        .executeTakeFirstOrThrow();

      return newCompany;
    });
  } catch (error) {
    console.log(error);
  }
}
