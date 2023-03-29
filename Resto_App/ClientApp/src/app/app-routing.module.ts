import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: 'resto',
    component: MainLayoutComponent,
    loadChildren: () => import('./resturant/resturant.module').then(m => m.ResturantModule)
  },
  { path: '', component: MainLayoutComponent },
  { path: "**", component: MainLayoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
