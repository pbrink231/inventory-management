import { Insertable, Selectable, Updateable } from 'kysely';
import { db } from '../db/database';
import { ProductVariants } from '../db/types';

export async function findInventoryById(id: number) {
  return await db.selectFrom('inventory').where('id', '=', id).selectAll().executeTakeFirst();
}

export async function adjustInventory(
  company_id: number,
  user_id: number,
  id: number,
  quantity: number
) {
  // use a transaction to ensure that the inventory is updated atomically
  try {
    return db.transaction().execute(async (trx) => {
      const inventory = await trx
        .selectFrom('inventory')
        .where('id', '=', id)
        .where('company_id', '=', company_id)
        .selectAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('inventory_transactions')
        .values({
          company_id: company_id,
          user_id: user_id,
          inventory_id: id,
          adjustment_quantity: quantity,
          reason: 'manual_adjustment'
        })
        .execute();

      // update inventory quantity by query total from inventory_transactions
      await trx.updateTable('inventory').set();

      await trx
        .updateTable('inventory')
        .set({ on_hand: newQuantity })
        .where('id', '=', id)
        .execute();
    });
  } catch (error) {
    console.log(error);
  }
}

export async function createProductVariant(product: Insertable<ProductVariants>) {
  return await db.insertInto('inventory').values(product).returningAll().executeTakeFirstOrThrow();
}
