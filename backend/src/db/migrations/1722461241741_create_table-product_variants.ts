import { Kysely, sql } from 'kysely';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('product_variants')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('company_id', 'integer', (col) => col.references('companies.id').notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('product_id', 'integer', (col) => col.references('products.id').notNull())
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('display_name', 'varchar', (col) => col.notNull())
    .addColumn('metadata', 'jsonb')
    .addColumn('archived_at', 'timestamptz')
    .addColumn('option_1_value', 'varchar')
    .addColumn('option_2_value', 'varchar')
    .addColumn('option_3_value', 'varchar')
    .addColumn('price', 'decimal')
    .addColumn('cost', 'decimal')
    .addColumn('model', 'varchar')
    .addColumn('sku', 'varchar')
    .addColumn('barcode', 'varchar')
    .addColumn('harmonized_system_code', 'varchar')
    .addColumn('weight', 'decimal')
    .addColumn('length', 'decimal')
    .addColumn('width', 'decimal')
    .addColumn('height', 'decimal')
    .addColumn('reorder_quantity', 'integer')
    .addColumn('case_quantity', 'integer')
    .addColumn('case_breakout_product_variant_id', 'integer', (col) =>
      col.references('product_variants.id')
    )
    .execute();

  await db.schema
    .alterTable('product_variants')
    .addUniqueConstraint('company_sku', ['company_id', 'sku'])
    .execute();

  await db.schema
    .alterTable('product_variants')
    .addUniqueConstraint('company_barcode', ['company_id', 'barcode'])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('product_variants').execute();
}
