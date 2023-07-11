import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { DepositlistComponent } from './depositlist/depositlist.component';
import { AdddepositComponent } from './adddeposit/adddeposit.component';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { WalletshareComponent } from './walletshare/walletshare.component';
import { WalletlistComponent } from './walletlist/walletlist.component';
import { PivotlistComponent } from './pivotlist/pivotlist.component';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbListModule, NbRouteTabsetModule, NbSpinnerModule, NbStepperModule, NbTabsetModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LayoutRoutingModule } from '../layout/layout-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { PagerService } from '../_services/pager.service';


@NgModule({
  declarations: [
    DepositlistComponent,
    AdddepositComponent,
    InvoicelistComponent,
    WalletshareComponent,
    WalletlistComponent,
    PivotlistComponent
  ],
  imports: [
    CommonModule,
    AutoCompleteNModule,
    AccountsRoutingModule,
    NbCardModule,
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
    NbSpinnerModule,
    LayoutRoutingModule,NbTreeGridModule,
    ReactiveFormsModule,
    ThemeModule
  ],

  providers: [
    
    PagerService 
    ],
})
export class AccountsModule { }
