import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from "@angular/common";

import {ProductListComponent} from "./product-list/product-list.component";
import {ProductCreateComponent} from "./product-create/product-create.component";
import {ProductComponent} from "./product.component";
import {ProductRoutingModule} from "./product.routing";
import {MatSelectModule} from "@angular/material";
import {CommonComponentsModule} from "../common-modules.model";


@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    ProductCreateComponent
  ],
  imports: [
    ProductRoutingModule,
    CommonComponentsModule,

    MatSelectModule
  ]
})
export class ProductModule {}
