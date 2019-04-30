import {Injectable} from "@angular/core";
import {Invoice} from "../models/invoice.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class InvoiceService{
  private invoices: Invoice[] = [];
  private url = "http://localhost:3000/api/invoices";
  private invoiceUpdated = new Subject<{invoices: Invoice[], count: number}>();
  invoiceAddError = new Subject<boolean>();
  count: number;

  constructor(private http: HttpClient, private router: Router) {}

  getInvoices(currentPage, invoicesPerPage) {
    const queryParams = `?pageSize=${invoicesPerPage}&currentPage=${currentPage}`;
    this.http.get<{message: string, invoices: Invoice[], count: number}>(this.url + queryParams)
      .subscribe(invoiceData =>{
        this.invoices = invoiceData.invoices;
        this.count = invoiceData.count;
        this.invoiceUpdated.next({invoices: [...this.invoices], count: this.count});
      });
  }

  getInvoiceUpdateListener() {
    return this.invoiceUpdated.asObservable();
  }

  getInvoice(id: String) {
    return this.http.get<{invoice: Invoice}>(this.url+"/"+ id);
  }

  addInvoice(invoice: Invoice) {
    this.http.post<{message: string, result: Invoice}>(this.url, invoice)
      .subscribe((invoiceData) =>{
        this.invoices.push(invoiceData.result);
        this.invoiceUpdated.next({invoices: [...this.invoices], count: this.count});
        this.router.navigate(['/invoice']);
      },(error) =>{
        console.log(error);
        this.invoiceAddError.next(true);
      });
  }

  updateInvoice(id, data) {
    this.http.put<{message: string, invoice: Invoice}>(this.url+"/"+id,  {id, ...data})
      .subscribe(() =>{
        this.router.navigate(['/invoice']);
      },(error) =>{
        this.invoiceAddError.next(true);
      });
  }


  editInvoice(invoice: Invoice) {
    this.router.navigate(['/invoice/edit',invoice._id]);
  }

  deleteInvoice(invoice: Invoice) {
    this.http.delete<{message: string}>(this.url+"/"+invoice._id)
      .subscribe(() =>{
        this.invoices = this.invoices.filter((item) => item._id != invoice._id);
        this.count -= 1;
        this.invoiceUpdated.next({invoices: [...this.invoices], count: this.count});
      },() =>{
        console.log("error!");
      });
  }

}
