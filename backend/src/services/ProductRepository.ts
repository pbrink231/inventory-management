import { Insertable, Selectable, Updateable } from 'kysely';
import { db } from '../db/database';
import { Products, ProductVariants } from '../db/types';

const MAX_VARIANTS = 2000;

type InsertableProduct = Omit<Insertable<Products>, 'company_id' | 'is_single_variant'> &
  Partial<Pick<Insertable<Products>, 'handle'>>;
type InsertableVariant = Omit<Insertable<ProductVariants>, 'product_id' | 'company_id'>;

export async function findProductById(id: number) {
  return await db.selectFrom('products').where('id', '=', id).selectAll().executeTakeFirst();
}

export async function findProducts(criteria: Partial<Selectable<Products>>) {
  let query = db.selectFrom('products');

  if (criteria.id) {
    query = query.where('id', '=', criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.name) {
    query = query.where('name', 'ilike', criteria.name);
  }

  return await query.selectAll().execute();
}

export async function updateProduct(id: number, updateWith: Updateable<Products>) {
  await db.updateTable('products').set(updateWith).where('id', '=', id).execute();
}

export async function createProduct(
  company_id: number,
  product: InsertableProduct,
  variants: InsertableVariant[]
) {
  // if product is using options, you need to create product and all product variants in a transaction
  // if product is not using options, you have to create the product and a single product variant

  if (product.id) {
    throw new Error('Product id must not be provided');
  }

  // check if product handle already exists
  if (product.handle) {
    const existingProduct = await db
      .selectFrom('products')
      .where('handle', '=', product.handle)
      .selectAll()
      .execute();
    if (existingProduct.length > 0) {
      throw new Error('Product with this handle already exists');
    }
  }

  // check if options are used in correct order
  if (product.option_1_name && product.option_1_values === null) {
    throw new Error('Option 1 values are required when using option 1');
  }
  if (product.option_2_name && product.option_2_values === null) {
    throw new Error('Option 2 values are required when using option 2');
  }
  if (product.option_1_values && product.option_2_values === null) {
    throw new Error('Option 2 values are required when using option 1 and option 2');
  }
  if (product.option_3_name && product.option_2_name === null) {
    throw new Error('Option 2 is required when using option 3');
  }
  if (product.option_2_name && product.option_1_name === null) {
    throw new Error('Option 1 is required when using option 2');
  }

  const option1Values = product.option_1_values ?? [];
  const option2Values = product.option_2_values ?? [];
  const option3Values = product.option_3_values ?? [];

  let isSingleVariantProduct = false;
  if (variants.length === 0) {
    throw new Error('Product must have at least one variant');
  }
  if (variants.length > MAX_VARIANTS) {
    throw new Error('Too many product variants');
  }
  // check if varaints are part of available variants
  if (
    variants.length === 1 &&
    !variants[0].option_1_value &&
    !variants[0].option_2_value &&
    !variants[0].option_3_value
  ) {
    // single variant product
    if (variants[0].id) {
      throw new Error('Variant id must not be provided');
    }
    isSingleVariantProduct = true;
  } else {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (variant.id) {
        throw new Error('Variant id must not be provided');
      }
      if (variant.option_3_value && !variant.option_2_value) {
        throw new Error('Option 2 value is required when using option 3');
      }
      if (variant.option_2_value && !variant.option_1_value) {
        throw new Error('Option 1 value is required when using option 2');
      }

      if (variant.option_1_value && !option1Values.includes(variant.option_1_value)) {
        throw new Error('Option 1 value is not part of available options');
      }
      if (variant.option_2_value && !option2Values.includes(variant.option_2_value)) {
        throw new Error('Option 2 value is not part of available options');
      }
      if (variant.option_3_value && !option3Values.includes(variant.option_3_value)) {
        throw new Error('Option 3 value is not part of available options');
      }
    }
  }

  // create product and variants
  try {
    return await db.transaction().execute(async (trx) => {
      const newProduct = await trx
        .insertInto('products')
        .values({
          ...product,
          handle: product.handle ?? product.name.toLowerCase().replace(/ /g, '-'),
          company_id: company_id,
          is_single_variant: isSingleVariantProduct
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const newVariants = [];
      for (const variant of variants) {
        newVariants.push({
          ...variant,
          company_id: company_id,
          product_id: newProduct.id
        });
      }

      await trx.insertInto('product_variants').values(newVariants).executeTakeFirstOrThrow();

      return newProduct;
    });
  } catch (error) {
    console.log(error);
  }
}
