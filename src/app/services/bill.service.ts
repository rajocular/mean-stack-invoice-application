import {Injectable} from "@angular/core";
import {Bill} from "../models/bill.model";
import {Product} from "../models/product.model";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class BillService{
  private bills: Bill[] = [];
  private url = "http://localhost/3000/api/bills";
  private billsUpdated = new Subject<Bill[]>();

  constructor(private http: HttpClient) {}

  getBills() {
    this.http.get<{message: string, bills: Bill[]}>(this.url)
      .subscribe(billData =>{
        console.log(billData);
        this.bills = billData.bills;
        this.billsUpdated.next([...this.bills]);
      });
  }

  getBillUpdateListener() {
    return this.billsUpdated.asObservable();
  }

  addBill(product: Product, quantity: number, amount: number, tax_amount: number, total: number) {
    this.bills.push({product, quantity, amount, tax_amount, total});
  }
}
