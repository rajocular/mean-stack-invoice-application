import { NgModule } from '@angular/core';

import {AreaListComponent} from "./area-list/area-list.component";
import {AreaCreateComponent} from "./area-create/area-create.component";
import {AreaRoutingModule} from "./area.routing";
import {AreaComponent} from "./area.component";
import {CommonComponentsModule} from "../common-modules.model";

@NgModule({
  declarations: [
    AreaComponent,
    AreaListComponent,
    AreaCreateComponent
  ],
  imports: [
    AreaRoutingModule,
    CommonComponentsModule
  ]
})
export class AreaModule {}
