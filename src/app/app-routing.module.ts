import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {NbAuthComponent} from '@nebular/auth';
import { LoginComponent } from './loginc/loginc.component';
import { ChangepaaswordComponent } from './pages/users/changepaasword/changepaasword.component';
export const routes: Routes = [
    {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'change password',
        component: ChangepaaswordComponent,

      }, 
      {
        path: 'logout',
        component: LoginComponent,
      },
    ],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
