import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CityComponent } from './city/city.component';
import { AccountComponent } from './account/account.component';
import { InstanceComponent } from './instance/instance.component';
import { DxDataGridModule,DxButtonModule  } from 'devextreme-angular';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { GstComponent } from './gst/gst.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserroleComponent } from './userrole/userrole.component';

@NgModule({
  declarations: [
    AppComponent,
    CityComponent,
    AccountComponent,
    InstanceComponent,
    DashboardComponent,
    UserComponent,
    GstComponent,
    UserroleComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule,
    DxButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
