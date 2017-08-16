import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
// import { NavController, ViewController, ModalController} from 'ionic-angular';


@Component({
  selector: 'add-contact-item',
  template: `
    <div class="selected-contact-item">
      {{itemname}}
      <ion-icon name="ios-close-outline" (click)="onRemoveItem()"></ion-icon>
    </div>
      `
})
export class AddContactItem implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @Input() contact: any;
  @Output() removeContact = new EventEmitter();
  public itemname: string = ""
 
  constructor(){
  }

  ngOnInit() {
  	this.itemname = this.contact.first_name +" "+ this.contact.last_name[0]+'.';
  }

  onRemoveItem() {
    this.removeContact.emit({id: this.contact});
  }
  
}
