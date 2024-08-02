import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('product_variant_serials')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id').notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('product_variant_id', 'integer', (col) =>
      col.references('product_variants.id').notNull()
    )
    .addColumn('serial_number', 'varchar', (col) => col.notNull())
    .addColumn('metadata', 'jsonb')
    .execute();

  await db.schema
    .alterTable('product_variant_serials')
    .addUniqueConstraint('variant_serial', ['product_variant_id', 'serial_number'])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('product_variant_serials').execute();
}
