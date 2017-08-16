import { Component } from '@angular/core';
import { NavController, ViewController, ModalController} from 'ionic-angular';
import { AddContactModal } from '../../pages/+contacts/contact-add/contact-add';
import { AddJobModal } from '../../pages/+jobs/job-add/job-add';
import { AssJobsPage } from '../../pages/+tasks/assjoblist/assjoblist';

@Component({
  selector: 'page-add-modal',
  templateUrl: 'add-modal.html'
})
export class AddModalPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page

  public addItems = [{id: 1, image: 'ios-checkmark', title: "New Task"}, {id: 2, image: 'ios-document-outline', title: "Send a Questionnaire"},{id: 3, image: 'ios-briefcase-outline', title: "New Job"},{id: 4, image: 'ios-person-outline', title: "New Contact"}];
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController) {
  }

  onClickNewItem(item){
    this.viewCtrl.dismiss();
    let addModal;
  	switch(item.id){
      case 1:
        this.navCtrl.push(AssJobsPage);
        break;
      case 2:
        break;
      case 3:
        addModal = this.modalCtrl.create(AddJobModal, {jobId: '', job:{}});
        addModal.onDidDismiss(data=> {
          this.viewCtrl.dismiss();
        });
        addModal.present();
        break;
      case 4:
        addModal = this.modalCtrl.create(AddContactModal, {contact: {}, jobFlag: false});
        addModal.onDidDismiss(data=> {
          this.viewCtrl.dismiss();
        });
        addModal.present();
        break;
    }
  }


  onCloseModal(){
  	this.viewCtrl.dismiss();
  }
  
}
