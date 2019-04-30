import { Component, OnInit } from '@angular/core';
import {Client} from "../models/client.model";
import {Product} from "../models/product.model";
import {ClientService} from "../services/client.service";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
