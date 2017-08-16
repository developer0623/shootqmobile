import { Component } from '@angular/core';
import { NavController, ViewController, ModalController} from 'ionic-angular';

@Component({
  selector: 'page-email-template-modal',
  templateUrl: 'email-template-modal.html'
})
export class EmailTemplateModal {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  public addItems = [{id: 1, image: 'checkmark', title: "New Task"}, {id: 2, image: 'ios-document-outline', title: "Send a Questionnaire"},{id: 3, image: 'ios-briefcase-outline', title: "New Job"},{id: 4, image: 'ios-person-outline', title: "New Contact"}];
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController) {
  }

  onClickNewItem(item){
  	
  }


  onCloseModal(){
  	this.viewCtrl.dismiss();
  }
  
}
