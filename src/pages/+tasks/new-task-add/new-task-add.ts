import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { CalendarModalPage } from "../../../components/calendar-modal/calendar-modal";
import { Contact } from '../../../models/contact';
import { Job } from '../../../models/job';

import { JobList }              from '../../../services/job/jobs';


@Component({
  selector: 'page-task-add',
  templateUrl: 'new-task-add.html'
})
export class NewTaskPage implements OnInit {
  public selectedJob: any;
  public selectedDate: any;
  public assignFlag: boolean = false;
  public beforeItemFlag: boolean = false;
  public taskLists:any;
	
	  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
              private jobListService: JobList, private modalCtrl: ModalController) {
            
  	}

    ngOnInit() {
      this.selectedJob = this.jobListService.getSelectedJob();
      this.taskLists = [{name:'col1',
                          options:[
                            {text:'Send Invoice', value:'1'},
                            {text:'Schedule Consultation', value: '2'},
                            {text:'Consultation', value: '3'},
                            {text:'Rent Lighting Equipment', value: '4'}
                          ]
                        }];

    }

    onClickAssign() {
      if(this.assignFlag == false) {
        this.assignFlag = true;
      }
      
    }
    onClickCal(){
      let calmodal = this.modalCtrl.create(CalendarModalPage, {event: true});
      calmodal.onDidDismiss(data => {
        this.selectedDate = data.selectedDate;
        console.log("selecteddate", data);
      });
      calmodal.present();
    }

    onClickSave(){

    }

    onClickClose(){
      this.viewCtrl.dismiss();
    }

  
  
}
