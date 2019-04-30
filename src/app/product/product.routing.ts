import {NgModule} from "@angular/core";
import {ProductComponent} from "./product.component";
import {ProductCreateComponent} from "./product-create/product-create.component";
import {RouterModule, Routes} from "@angular/router";
import {ProductListComponent} from "./product-list/product-list.component";

const productRoutes: Routes = [
  {path: '', component: ProductComponent, children:[
      {path: '', component: ProductListComponent},
      {path: 'create', component: ProductCreateComponent},
      {path: 'edit/:id', component: ProductCreateComponent}
    ]}
];
@NgModule({
  imports: [RouterModule.forChild(productRoutes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
