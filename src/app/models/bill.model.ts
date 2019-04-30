import {Product} from "./product.model";

export interface Bill {
  product: Product;
  quantity: number;
  amount: number;
  tax_amount: number;
  total: number;
}
