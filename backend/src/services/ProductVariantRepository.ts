import { Insertable, Selectable, Updateable } from 'kysely';
import { db } from '../db/database';
import { ProductVariants } from '../db/types';

export async function findProductVariantById(id: number) {
  return await db
    .selectFrom('product_variants')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function findProductVariants(criteria: Partial<Selectable<ProductVariants>>) {
  let query = db.selectFrom('product_variants');

  if (criteria.id) {
    query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.title) {
    query = query.where('title', 'ilike', criteria.title);
  }

  return await query.selectAll().execute();
}

export async function updateProductVariant(id: number, updateWith: Updateable<ProductVariants>) {
  await db.updateTable('product_variants').set(updateWith).where('id', '=', id).execute();
}

export async function createProductVariant(product: Insertable<ProductVariants>) {
  return await db
    .insertInto('product_variants')
    .values(product)
    .returningAll()
    .executeTakeFirstOrThrow();
}
