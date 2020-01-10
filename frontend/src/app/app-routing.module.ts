import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalonModule } from './salon/salon.module';
import{AdminModule} from './admin/admin.module';


const routes: Routes = [
{path:'salon',loadChildren:() => import('../app/salon/salon.module').then(m=>m.SalonModule)},
{path:'admin',loadChildren:() => import('../app/admin/admin.module').then(m=>m.AdminModule)},
{path:'',loadChildren:() => import('../app/user/user.module').then(m=>m.UserModule)}
 ,{path:'',redirectTo:'',pathMatch:"full"} ];

//{ path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }