import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ClientComponent} from "./client.component";
import {ClientCreateComponent} from "./client-create/client-create.component";
import {ClientListComponent} from "./client-list/client-list.component";

const clientRoutes: Routes = [
  {path: '', component: ClientComponent, children:[
      {path: ':type', component: ClientListComponent},
      {path: ':type/create', component: ClientCreateComponent},
      {path: ':type/edit/:id', component: ClientCreateComponent},
    ]}
];

@NgModule({
  imports:[RouterModule.forChild(clientRoutes)],
  exports:[RouterModule]
})
export class ClientRoutingModule {}
