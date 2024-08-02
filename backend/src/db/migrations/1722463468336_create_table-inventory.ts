import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('inventory')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id').notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('product_variant_id', 'integer', (col) =>
      col.references('product_variants.id').notNull()
    )
    .addColumn('location_id', 'integer', (col) => col.references('locations.id').notNull())
    .addColumn('on_hand', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('available', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('committed', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('unavailable', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('metadata', 'jsonb')
    .addColumn('bin', 'varchar')
    .addColumn('overflow_bin', 'varchar')
    .addColumn('reorder_threshold', 'integer')

    .execute();

  await db.schema
    .createIndex('variant_id_index')
    .on('inventory')
    .column('product_variant_id')
    .execute();

  await db.schema.createIndex('location_id_index').on('inventory').column('location_id').execute();

  await db.schema
    .alterTable('inventory')
    .addUniqueConstraint('variant_location', ['product_variant_id', 'location_id'])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('inventory').execute();
}
