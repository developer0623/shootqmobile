import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams, Content, LoadingController, Events , ActionSheetController, AlertController} from 'ionic-angular';
import { EventGroup } from '../../../../models/event-group';
import { EventService } from '../../../../services/event';
import { EventModalComponent } from "../event-modal/event-modal";


import * as _ from 'lodash';
import moment from 'moment';

@Component({
  selector: 'group-events',
  templateUrl: 'group-events.html'
})
export class GroupEventsComponent implements OnInit {
	@Input() eventgroup: EventGroup;
	  

  constructor(private actionSheetCtrl: ActionSheetController, private modalCtrl: ModalController, private alertCtrl: AlertController,
  	private eventService: EventService) {
  
  }

  ngOnInit(){
  	console.log("groupevent", this.eventgroup);
  }

  onClickEvent(event, index) {
  	let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Edit",
          handler: () =>{
            this.onEditEvent(event, index);
          }
        },
        {
          text: "Delete",
          handler: () => {
            this.makingAlert("Are you sure that you want to delete this?", index, event);
          }
        }
      ]
    });
    actionSheet.present();
  }

  onEditEvent(event, index){
    let newEventModal = this.modalCtrl.create(EventModalComponent, { event: event, editflag: true });
    newEventModal.onDidDismiss(data=> {
      if(data.event){
      	this.eventgroup.events[index] = data.event;
      }
    });
    newEventModal.present();
  }

  makingAlert(message, index, event){
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: ()=> {
            
              this.deleteEventFunc(event, index);
           

          }
        }

      ]
    });
    alert.present();
  }

  deleteEventFunc(event, index) {
    let eventId = this.eventgroup.events[index].id;
    
    this.eventService.delete(eventId).subscribe(() => {
       this.eventgroup.events.splice(index, 1);
    });     

  }

  addEventItem(){
  	let index = this.eventgroup.events.length+1;
    let newEventItem = EventService.newObject({
      name: 'New event',
      event_group: this.eventgroup.id,
      account: this.eventgroup.account
    });
    // this.onEditEvent(newEventItem, index);
    // this.eventgroup.events.splice(index, 0, newEventItem);
    let newEventModal = this.modalCtrl.create(EventModalComponent, { event: newEventItem, editflag: false });
    newEventModal.onDidDismiss(data=> {
    	if(data.event){
    		this.eventgroup.events.splice(index, 0, data.event);
    	}
      
    });
    newEventModal.present();
  }




}
