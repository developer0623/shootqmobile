import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams} from 'ionic-angular';

 import { NewTaskPage } from '../../+tasks/new-task-add/new-task-add';
 import { NewEventModal } from "../new-event/new-event";
 import { JobEventGroupModal } from "../job-eventgroup-modal/job-eventgroup-modal";

@Component({
  selector: 'task-add-modal',
  templateUrl: 'task-add-modal.html'
})
export class TaskAddModal {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  public jobId:any;
  public addItems = [{id: 1, image: 'ios-checkmark', title: "Add Task"}, {id: 2, image: 'md-calendar', title: "Add Event"}];
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController, private navParams:NavParams) {
    this.jobId = this.navParams.get("jobId");
  }

  onClickNewItem(item){
    this.viewCtrl.dismiss();
    let addModal;
  	switch(item.id){
      case 1:
        addModal = this.modalCtrl.create(NewTaskPage);
        break;
      case 2:
        // addModal = this.modalCtrl.create(NewEventModal);
        addModal = this.modalCtrl.create(JobEventGroupModal, { jobId: this.jobId, editflag: false, eventgroup: {} });
        
        
            break;
        }

        addModal.onDidDismiss(data=> {
          this.viewCtrl.dismiss();
        });

        addModal.present();
  }


  onCloseModal(){
  	this.viewCtrl.dismiss();
  }
  
}
