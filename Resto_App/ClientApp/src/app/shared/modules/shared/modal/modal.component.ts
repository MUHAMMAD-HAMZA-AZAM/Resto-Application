import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() title: string = '';
  constructor(public activeModal: NgbModal) { }
  ngOnInit() {

  }
  closeModal() {
    this.activeModal.dismissAll();
  }
}
