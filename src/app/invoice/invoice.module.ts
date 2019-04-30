import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from "@angular/common";

import {InvoiceCreateComponent} from "./invoice-create/invoice-create.component";
import {InvoiceListComponent} from "./invoice-list/invoice-list.component";
import {InvoiceRoutingModule} from "./invoice.routing";
import {InvoiceComponent} from "./invoice.component";
import {
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule
} from "@angular/material";
import {CommonComponentsModule} from "../common-modules.model";


@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceListComponent,
    InvoiceCreateComponent
  ],
  imports: [
    InvoiceRoutingModule,
    CommonComponentsModule,

    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule
  ]
})
export class InvoiceModule {}
