import { NgModule } from '@angular/core';

import {ClientListComponent} from "./client-list/client-list.component";
import {ClientCreateComponent} from "./client-create/client-create.component";
import {ClientComponent} from "./client.component";
import {ClientRoutingModule} from "./client.routing";
import {
  MatOptionModule,
  MatSelectModule,
} from "@angular/material";
import {CommonComponentsModule} from "../common-modules.model";


@NgModule({
  declarations: [
    ClientComponent,
    ClientListComponent,
    ClientCreateComponent
  ],
  imports: [
    ClientRoutingModule,
    CommonComponentsModule,

    MatOptionModule,
    MatSelectModule
  ]
})
export class ClientModule {}
