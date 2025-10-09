import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CityComponent } from './city/city.component';
import { AccountComponent } from './account/account.component';
import { InstanceComponent } from './instance/instance.component';

@NgModule({
  declarations: [
    AppComponent,
    CityComponent,
    AccountComponent,
    InstanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
