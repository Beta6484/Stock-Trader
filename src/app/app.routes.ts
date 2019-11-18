import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './+dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'proposals',
        loadChildren: './+proposals/proposals.module#ProposalsModule'
      },
      {
        path: 'orders',
        loadChildren: './+orders/orders.module#OrdersModule'
      },
      {
        path: 'portfolio',
        loadChildren: './+portfolio/portfolio.module#PortfolioModule'
      }
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './+auth/+login/login.module#LoginModule'
      }
    ]
  },
  {
    path: 'register',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './+auth/+register/register.module#RegisterModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]