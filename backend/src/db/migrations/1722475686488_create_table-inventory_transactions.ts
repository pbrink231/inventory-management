import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('inventory_transactions')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id').notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('inventory_id', 'integer', (col) => col.references('inventory.id').notNull())
    .addColumn('user_id', 'integer', (col) => col.references('users.id').notNull())
    .addColumn('adjustment_quantity', 'integer', (col) => col.notNull())
    .addColumn('reconciled_quantity', 'integer')
    .addColumn('reason', 'text', (col) => col.notNull())
    .addColumn('serial_number', 'varchar')
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('inventory_transactions').execute();
}
