import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { StbreportComponent } from './stbreport/stbreport.component';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbListModule, NbRouteTabsetModule, NbSpinnerModule, NbStepperModule, NbTabsetModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LayoutRoutingModule } from '../layout/layout-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PagerService } from '../_services/index';
import { CustboxassignlogComponent } from './custboxassignlog/custboxassignlog.component';
import { DepositelogComponent } from './depositelog/depositelog.component';
import { PackagelogComponent } from './packagelog/packagelog.component';
import { PackageremarkComponent } from './packageremark/packageremark.component';


@NgModule({
  declarations: [
    StbreportComponent,
    CustboxassignlogComponent,
    DepositelogComponent,
    PackagelogComponent,
    PackageremarkComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    NbCardModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbCardModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbStepperModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    LayoutRoutingModule,NbTreeGridModule,
    ReactiveFormsModule,
    ThemeModule,
    FormsModule,
    AutoCompleteNModule,
    AutocompleteLibModule,
  ],
  providers: [
     PagerService,
  ],
})
export class ReportModule { }
