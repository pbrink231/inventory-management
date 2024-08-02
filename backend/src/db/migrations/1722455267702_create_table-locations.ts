import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('locations')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id').notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('fulfill_orders', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('metadata', 'jsonb')
    .addColumn('address', 'jsonb')
    .addColumn('archived_at', 'timestamptz')
    .addUniqueConstraint('company_location_name', ['company_id', 'name'])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('locations').execute();
}
