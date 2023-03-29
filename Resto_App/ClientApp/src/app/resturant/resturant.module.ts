import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResturantsComponent } from './resturants/resturants.component';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';
const routes: Routes = [
  { path: 'resturents', component: ResturantsComponent }
]


@NgModule({
  declarations: [
    ResturantsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule
  ]
})
export class ResturantModule { }
