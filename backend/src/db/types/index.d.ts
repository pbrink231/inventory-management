import { JsonAddress } from './jsonTypes';
import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Companies {
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Timestamp>;
}

export interface Locations {
  address: JsonAddress | null;
  company_id: number;
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Timestamp>;
}

export interface Products {
  brand: string | null;
  category: string | null;
  company_id: number;
  created_at: Generated<Timestamp>;
  description: string | null;
  handle: string;
  id: Generated<number>;
  is_single_variant: boolean;
  name: string;
  option_1_name: string | null;
  option_1_values: string[] | null;
  option_2_name: string | null;
  option_2_values: string[] | null;
  option_3_name: string | null;
  option_3_values: string[] | null;
  serialized: boolean;
  updated_at: Generated<Timestamp>;
}

export interface ProductVariants {
  archived_at: Timestamp | null;
  barcode: string | null;
  case_breakout_product_variant_id: number | null;
  case_quantity: number | null;
  company_id: number;
  cost: Numeric | null;
  created_at: Generated<Timestamp>;
  display_name: string;
  harmonized_system_code: string | null;
  height: Numeric | null;
  id: Generated<number>;
  length: Numeric | null;
  model: string | null;
  option_1_value: string | null;
  option_2_value: string | null;
  option_3_value: string | null;
  price: Numeric | null;
  product_id: number;
  reorder_quantity: number | null;
  sku: string | null;
  title: string;
  updated_at: Generated<Timestamp>;
  weight: Numeric | null;
  width: Numeric | null;
}

export interface UserCompanies {
  company_id: number;
  created_at: Generated<Timestamp>;
  id: Generated<number>;
  updated_at: Generated<Timestamp>;
  user_id: number;
}

export interface Users {
  created_at: Generated<Timestamp>;
  email: string;
  first_name: string | null;
  id: Generated<number>;
  last_name: string | null;
  name: string | null;
  password: string;
  phone: string | null;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  companies: Companies;
  locations: Locations;
  product_variants: ProductVariants;
  products: Products;
  user_companies: UserCompanies;
  users: Users;
}
