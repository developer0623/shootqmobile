import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController, ViewController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventGroup } from '../../../../models/event-group';
import { BaseLocation, BaseAddress } from '../../../../models/address';
import { EventService } from '../../../../services/event';
import { CalendarModalPage } from "../../../../components/calendar-modal/calendar-modal";
import * as _ from 'lodash';
import moment from 'moment';

@Component({
  selector: 'event-modal',
  templateUrl: 'event-modal.html'
})
export class EventModalComponent implements OnInit {
	
  eventItemForm: FormGroup;
  eventItem : any;

  public startDate: string;
  public endDate: string;
  public editFlag: boolean = false;
  public eventlocation: any;
  constructor(private fb: FormBuilder, private navParams: NavParams, private modalCtrl: ModalController,
  	private viewCtrl: ViewController, private eventService: EventService) {
  	this.eventItem = this.navParams.get("event");
  	this.editFlag = this.navParams.get('editflag');
  }

  ngOnInit(){
  	this.setUpEventItemForm();
  }

  setUpEventItemForm(){
  	this.eventItemForm = this.fb.group({
  		name: [this.eventItem.name, Validators.required],
  		start: [this.eventItem.start, Validators.required],
  		end: [this.eventItem.end, Validators.required],
  		location_name: this.getLocationNameFromEvent(),
  		location: this.getAddressFromEvent()
  	});

  	if(this.editFlag){
       this.startDate = this.eventItem.start;
       this.endDate = this.eventItem.end;
    }
  }


  getAddress(place){
    let address = BaseLocation.extractFromGooglePlaceResult(place);
    address.name = this.eventItemForm.value.location_name;
    this.eventItemForm.patchValue({
    	location: address.address1
    });
    this.eventlocation = address;
  }

  onClickStart(){
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.eventItemForm['controls'].start.setValue(convertedDate.momentDate.startOf('date'));
        this.startDate = convertedDate.stringDate.toUTCString();
    });
    modal1.present();
  }

  onClickEnd() {
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{ 
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.eventItemForm['controls'].end.setValue(convertedDate.momentDate.endOf('date'));
        this.endDate = convertedDate.stringDate.toUTCString();
    });
    modal1.present();

  }

  combineDateAndTime(date, time){
    let newdate = new Date(date);
    let year = newdate.getFullYear();
    let month = newdate.getMonth()+1;
    let day = newdate.getDate();
    let dateString = '' + year + '-' + month + '-' + day;
    let fulldate = new Date (dateString + ' ' + time);
    return {momentDate:moment(fulldate), stringDate: fulldate};
  }

  private getAddressFromEvent(): string {
    return <string>_.get(this.eventItem, 'location.address1', '');
  }
  private getLocationNameFromEvent(): string {
    return <string>_.get(this.eventItem, 'location.name', '');
  }


  onSave() {
  	let event: Event = Object.assign(this.eventItem, this.eventItemForm.value, {location: this.eventlocation});
  	
  	this.eventService.save(event).subscribe((event)=> {
  		this.viewCtrl.dismiss({event: event});
  	})
  }

  onCancel() {
  	this.viewCtrl.dismiss({event:''});
  }

}
