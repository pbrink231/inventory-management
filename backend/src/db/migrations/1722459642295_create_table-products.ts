import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('products')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id').notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('handle', 'varchar', (col) => col.notNull())
    .addColumn('serialized', 'boolean', (col) => col.notNull())
    .addColumn('is_single_variant', 'boolean', (col) => col.notNull())
    .addColumn('metadata', 'jsonb')
    .addColumn('description', 'text')
    .addColumn('category', 'varchar')
    .addColumn('brand', 'varchar')
    .addColumn('option_1_name', 'varchar')
    .addColumn('option_1_values', 'jsonb')
    .addColumn('option_2_name', 'varchar')
    .addColumn('option_2_values', 'jsonb')
    .addColumn('option_3_name', 'varchar')
    .addColumn('option_3_values', 'jsonb')
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('products').execute();
}
