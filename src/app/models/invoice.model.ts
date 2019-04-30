import {Client} from "./client.model";
import {Bill} from "./bill.model";

export interface Invoice{
  _id: string;
  date: number;
  client: Client;
  bills: Bill[];
  amount: number;
  tax_amount: number;
  total: number;
}
