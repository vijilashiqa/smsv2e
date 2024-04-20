import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { UsersRoutingModule } from './users-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { CancelshareComponent } from './cancelshare/cancelshare.component';
import { UserlistComponent } from './userlist/userlist.component';

import { EditUserComponent } from './edit-user/edit-user.component';
import { UpdateShareComponent } from './update-share/update-share.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletlistComponent } from './walletlist/walletlist.component';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbListModule, NbRouteTabsetModule, NbSpinnerModule, NbStepperModule, NbTabsetModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LayoutRoutingModule } from '../layout/layout-routing.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { PagerService } from '../_services/index';
import { ThemeModule } from '../../@theme/theme.module';
import { AutoCompleteNModule } from '../auto-complete-module/auto-completen-module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UserhdcasComponent } from './userhdcas/userhdcas.component';
import { filterModule } from '../filter/filter-module';
import { RoleeditUserComponent } from './roleedit-user/roleedit-user.component';
@NgModule({
  declarations: [
    AddUserComponent,
    CancelshareComponent,
    UserlistComponent,
    EditUserComponent,
    UpdateShareComponent,
    WalletComponent,
    WalletlistComponent,
    UserhdcasComponent,
    RoleeditUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NbCardModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbCardModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbStepperModule,
    TreeModule.forRoot(),
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
    AutocompleteLibModule,
    AutoCompleteNModule,
    filterModule,
    FormsModule,
  ],

   
  providers: [
    
    PagerService ,
  ],


  entryComponents:[
   
    UserhdcasComponent
  ],
})
export class UsersModule { }
