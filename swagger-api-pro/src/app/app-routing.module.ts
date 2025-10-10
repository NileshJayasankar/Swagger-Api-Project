import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city/city.component';
import { InstanceComponent } from './instance/instance.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { GstComponent } from './gst/gst.component';
import { UserroleComponent } from './userrole/userrole.component';

const routes: Routes = [
  { path: 'city', component: CityComponent },
  { path: 'account', component: AccountComponent },
  { path: 'instance', component: InstanceComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user', component: UserComponent },
  { path: 'userrole', component: UserroleComponent },
  { path: 'gst', component: GstComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {

  
 }
