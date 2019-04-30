import {NgModule} from "@angular/core";
import {AreaComponent} from "./area.component";
import {AreaCreateComponent} from "./area-create/area-create.component";
import {RouterModule, Routes} from "@angular/router";
import {AreaListComponent} from "./area-list/area-list.component";

const areaRoutes: Routes = [
  {path: '', component: AreaComponent, children:[
      {path: '', component: AreaListComponent},
      {path: 'create', component: AreaCreateComponent},
      {path: 'edit/:id', component: AreaCreateComponent}
    ]}
];

@NgModule({
  imports:[RouterModule.forChild(areaRoutes)],
  exports:[RouterModule]
})
export class AreaRoutingModule{}
