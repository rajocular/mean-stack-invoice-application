import { Component, OnInit } from '@angular/core';
import {Client} from "../../models/client.model";
import {Product} from "../../models/product.model";
import {ClientService} from "../../services/client.service";
import {ProductService} from "../../services/product.service";
import {MatTableDataSource, PageEvent} from "@angular/material";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  clients: Client[];
  products: Product[];

  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'hsn', 'tax', 'cost_price', 'sale_price', 'mrp', 'stock', 'options'];

  loading = false;

  totalProducts;
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private clientService: ClientService, private productService: ProductService) { }

  ngOnInit() {
    this.loading = true;
    this.clientService.getClients();
    this.clientService.getClientUpdateListener()
      .subscribe(({clients,count}) =>{
        this.clients = clients;
      });
    this.productService.getProducts(this.currentPage, this.productsPerPage);
    this.productService.getProductUpdateListener()
      .subscribe(({products, count}) =>{
        this.loading = false;
        this.products = products;
        this.totalProducts = count;
        this.dataSource = new MatTableDataSource(this.products);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(element: Product) {
    this.productService.editProduct(element);
  }

  onChange(data: PageEvent) {
    this.currentPage = data.pageIndex + 1;
    this.productsPerPage = data.pageSize;
    this.productService.getProducts(this.currentPage, this.productsPerPage);
  }

  onDelete(element: Product) {
    confirm("Are you sure that you want to delete this area?")? this.productService.deleteProduct(element): null;
  }

}
