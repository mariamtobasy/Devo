import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Master } from './pages/master/master';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // 👈 login first
  { path: 'login', component: Login },  
      { path: 'register', component: Register},
     //   { path: 'login', component: LoginComponent },
   {  path: '',//ngular handles it in order — top to bottom.
    component:Master, // your master layout
    children: [
      { path: 'dashboard', component: Dashboard}, // base dashboard page
       // Redirect empty child path to dashboard
     { path: '', redirectTo: '/dashboard', pathMatch: 'full' } 
    //  { path: 'dashboard', component: DashboardComponent }, // For You
    //  { path: 'recent', component: RecentComponent },
    //  { path: 'starred', component: StarredComponent },
     // { path: 'done', component: DoneComponent },
    //  { path: 'summary', component: SummaryComponent },
    //  { path: 'contact', component: ContactComponent },
    
     
    ],
  },
];
