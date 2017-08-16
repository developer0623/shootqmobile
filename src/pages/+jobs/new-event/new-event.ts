import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { CalendarModalPage } from "../../../components/calendar-modal/calendar-modal";
import { Contact } from '../../../models/contact';
import { Job } from '../../../models/job';

import { JobList }              from '../../../services/job/jobs';


@Component({
  selector: 'page-event-add',
  templateUrl: 'new-event.html'
})
export class NewEventModal implements OnInit {
  public selectedJob: any;
  public selectedDate: any;
  public startTime: any;
  public endTime: any;
  public dateFlag: boolean = false;
  public assignFlag: boolean = false;
  
	
	  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
              private jobListService: JobList, private modalCtrl: ModalController) {
            
  	}

    ngOnInit() {
      this.selectedJob = this.jobListService.getSelectedJob();
      
    }

    onClickAssign() {
      if(this.assignFlag == false) {
        this.assignFlag = true;
      }
      
    }
    onClickCal(){
      let calmodal = this.modalCtrl.create(CalendarModalPage);
      calmodal.onDidDismiss(data => {
        this.selectedDate = data.selectedDate;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.dateFlag = true;
      });
      calmodal.present();
    }

    onClickSave(){
      this.viewCtrl.dismiss();
    }

    onClickClose(){
      this.viewCtrl.dismiss();
    }

  
  
}
