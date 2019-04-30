import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InvoiceComponent} from "./invoice.component";
import {InvoiceCreateComponent} from "./invoice-create/invoice-create.component";
import {InvoiceListComponent} from "./invoice-list/invoice-list.component";

const invoiceRoutes: Routes = [
  {path: '', component: InvoiceComponent, children:[
      {path: '', component:InvoiceListComponent},
      {path: 'create', component: InvoiceCreateComponent},
      {path: 'edit/:id', component: InvoiceCreateComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(invoiceRoutes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule{}
