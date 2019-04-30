import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./authentication/auth-guard";
import {RegisterComponent} from "./login/register/register.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule', canActivate: [AuthGuard]},
  {path: 'area', loadChildren: './area/area.module#AreaModule', canActivate: [AuthGuard]},
  {path: 'client', loadChildren: './client/client.module#ClientModule', canActivate: [AuthGuard]},
  {path: 'product', loadChildren: './product/product.module#ProductModule', canActivate: [AuthGuard]},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
