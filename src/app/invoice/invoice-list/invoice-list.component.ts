import { Component, OnInit } from '@angular/core';
import {Invoice} from "../../models/invoice.model";
import {InvoiceService} from "../../services/invoice.service";
import {ClientService} from "../../services/client.service";
import {MatTableDataSource, PageEvent} from "@angular/material";
import {BillService} from "../../services/bill.service";
import {Bill} from "../../models/bill.model";

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[];
  bills: Bill[];

  dataSource: MatTableDataSource<Invoice>;
  displayedColumns: string[] = ['client', 'date', 'total','options'];

  loading = false;

  totalInvoices = 0;
  invoicesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.loading = true;
    this.invoiceService.getInvoices(this.currentPage, this.invoicesPerPage);
    this.invoiceService.getInvoiceUpdateListener()
      .subscribe(({invoices, count})=>{
        this.loading = false;
        this.invoices = invoices;
        this.totalInvoices = count;
        this.dataSource = new MatTableDataSource(this.invoices);
      })
  }

  onEdit(element: Invoice) {
    this.invoiceService.editInvoice(element);
  }

  onChange(data: PageEvent) {
    this.currentPage = data.pageIndex + 1;
    this.invoicesPerPage = data.pageSize;
    this.invoiceService.getInvoices(this.currentPage, this.invoicesPerPage);
  }

  onDelete(element: Invoice) {
    confirm("Are you sure that you want to delete this area?")? this.invoiceService.deleteInvoice(element): null;
  }

}
