import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { CutomerRoutingModule } from './cutomer-routing.module';
import { AddCustComponent } from './add-cust/add-cust.component';
import { CustListComponent } from './cust-list/cust-list.component';
import { CustTransferComponent } from './cust-transfer/cust-transfer.component';
import { SurenderStbComponent } from './surender-stb/surender-stb.component';
import { UsersRoutingModule } from '../users/users-routing.module';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbListModule, NbRouteTabsetModule, NbStepperModule, NbTabsetModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LayoutRoutingModule } from '../layout/layout-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PagerService } from '../_services/index';
import { filterModule } from '../filter/filter-module';
import { EditCustComponent } from './edit-cust/edit-cust.component';
import { ViewCustComponent } from './view-cust/view-cust.component';
import { RenewCustComponent } from './renew-cust/renew-cust.component';
import { SurrenderComponent } from './surrender/surrender.component';
@NgModule({
  declarations: [
    AddCustComponent,
    CustListComponent,
    CustTransferComponent,
    SurenderStbComponent,
    EditCustComponent,
    ViewCustComponent,
    RenewCustComponent,
    SurrenderComponent
  ],
  imports: [
    CommonModule,
    CutomerRoutingModule,
    CommonModule,
    UsersRoutingModule,
    NbCardModule,
    NbTabsetModule,
    NbSpinnerModule,
    FormsModule,
    NbCardModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbStepperModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbCheckboxModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    LayoutRoutingModule, NbTreeGridModule,
    ReactiveFormsModule,
    ThemeModule,
    AutoCompleteNModule,
    AutocompleteLibModule,
    filterModule
  ],


  providers: [

    PagerService,
  ],
})
export class CutomerModule { }
