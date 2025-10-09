import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city/city.component';
import { InstanceComponent } from './instance/instance.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: 'city', component: CityComponent },
  { path: 'account', component: AccountComponent },
  { path: 'instance', component: InstanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {

  
 }
