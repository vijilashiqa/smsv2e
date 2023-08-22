import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StbreportComponent } from './stbreport/stbreport.component';
import { CustboxassignlogComponent } from './custboxassignlog/custboxassignlog.component';
import { DepositelogComponent } from './depositelog/depositelog.component';
import { PackagelogComponent } from './packagelog/packagelog.component';

const routes: Routes = [
  {
    path:'stbreport',
    component: StbreportComponent,
  },
  {
    path:'custboxassignlog',
    component: CustboxassignlogComponent,
  },
  {
    path:'depositlog',
    component: DepositelogComponent,
  },
  {
    path:'packagelog',
    component: PackagelogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
