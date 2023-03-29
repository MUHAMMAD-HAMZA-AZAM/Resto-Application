import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    ModalComponent
  ],
  providers: [
    NgbActiveModal
  ]
})
export class SharedModule { }
