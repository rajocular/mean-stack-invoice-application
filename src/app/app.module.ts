import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {
  MatToolbarModule,
  MatButtonModule, MatFormFieldModule, MatInputModule, MatStepperModule, MatCheckboxModule
} from "@angular/material";
import {AreaModule} from "./area/area.module";
import {ClientModule} from "./client/client.module";
import {ProductModule} from "./product/product.module";
import { PurchaseRegisterComponent } from './purchase-register/purchase-register.component';
import { CreateComponent } from './purchase-register/create/create.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptor} from "./authentication/auth-interceptor";
import { RegisterComponent } from './login/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PurchaseRegisterComponent,
    CreateComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AreaModule,
    ClientModule,
    ProductModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
