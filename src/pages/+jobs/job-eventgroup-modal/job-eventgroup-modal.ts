import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { CalendarModalPage } from "../../../components/calendar-modal/calendar-modal";
import * as _ from 'lodash';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { EventGroup } from '../../../models/event-group';
import { EventType } from '../../../models/event-type';
import { BaseLocation, BaseAddress } from '../../../models/address';
import { datesIntervalValidator } from '../../../validators';
import { EventTypeService } from "../../../services/event-type";
import { EventGroupService } from "../../../services/event-group";
import { ApiService } from '../../../services/api/api.service';

export interface EventGroupFormModel {
  name: string;
  created?: string;
  updated?: string;
  location?: BaseAddress;
  start: string;
  end: string;
  location_name: string;
  address?: string;
  description?: string;
  all_day?: boolean;
  event_type?: number;
}

@Component({
  selector: 'job-eventgroup-modal',
  templateUrl: 'job-eventgroup-modal.html'
})
export class JobEventGroupModal implements OnInit {
	public jobId: any;
	public isLoading:boolean = false;
  public editFlag: boolean = false;
  public selectType:any;
   	public startDate: string;
   	public endDate: string;
   	public eventGroup: EventGroup = new EventGroup();
    public validFlags: boolean = false;
   	form: FormGroup;
   	formValue: EventGroupFormModel;
   	eventTypesOptions: {value: number, label: string}[];
   	eventTypes: EventType[];
  public method: string = "create";

	
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private modalCtrl: ModalController, private loadingCtrl: LoadingController,
    private eventTypeService: EventTypeService, private eventGroupService: EventGroupService, private apiService: ApiService,private navParams: NavParams, private fb: FormBuilder) {
    
    this.jobId = this.navParams.get('jobId');
    this.editFlag = this.navParams.get('editflag');
    this.eventGroup = this.navParams.get("eventgroup");
    this.method =  this.editFlag ? 'update' : 'create';
  }

  ngOnInit(){
    if(this.editFlag){
      this.loadEventTypes();
    } else {
      this.initData();
    }
  }	
    
    
  

  initData() {
      let loading = this.loadingCtrl.create();
      loading.present();
      Observable.forkJoin([
        this.loadEventTypes1(),
        this.initCreateEventGroup(),
      ]).finally(() => {  this.isLoading = true; loading.dismiss();})
        .subscribe(([eventTypes, eventGroup]: [any, any]) => {
          this.eventTypes = eventTypes;
          this.eventGroup = eventGroup;
          this.isLoading = true;
          this.initForm();
        });
    }

    loadEventTypes1() {
      return this.eventTypeService.getList().map(res => res.results.map(eventType => (EventTypeService.newObject(eventType))));     
    }

    initCreateEventGroup(){
      let data = {
        name: "Event group",
        job: this.jobId
      };
        return this.eventGroupService.create(data);
      
    }

  loadEventTypes() {
    this.eventTypeService.getList().subscribe((res) => {
      this.eventTypes = res.results;
      this.isLoading = true;
      this.initForm();
      console.log("event types", this.eventTypes);
    });
  }

  // private initEventTypeOptions() {
  //   let options = this.eventTypes.map((t) => {
  //     return {value: t.id, label: t.name};
  //   });
  //   options.unshift({value: null, label: 'Select Event Type'});
  //   this.eventTypesOptions = options;
  // }

  private eventGroupToFormValue(eventGroup: EventGroup): EventGroupFormModel {
    let formModel = <EventGroupFormModel>Object.assign(
      _.pick(eventGroup, ['name', 'location_name', 'address', 'description', 'all_day', 'start', 'end', 'event_type'])
    );
    return formModel;
  }

  private formValueToEventGroup(formValue: EventGroupFormModel): EventGroup {
    return Object.assign({}, this.eventGroup, formValue);
  }

  private initForm() {
    this.formValue = this.eventGroupToFormValue(this.eventGroup);
    this.form = this.fb.group({
      name: [this.formValue.name, Validators.required],
      start: [this.formValue.start, Validators.required],
      end: [this.formValue.end, Validators.required],
      location_name: this.formValue.location_name,
      address: this.formValue.address,
      description: this.formValue.description,
      all_day: this.formValue.all_day,
      event_type: this.formValue.event_type
    }, {
      validator:datesIntervalValidator('start', 'end')}
    );

    if(this.editFlag){
       this.startDate = this.formValue.start;
       this.endDate = this.formValue.end;
    }
    
  }

  getAddress(place){
    let address = BaseLocation.extractFromGooglePlaceResult(place);
    address.name = this.formValue.location_name;
    this.form.patchValue({
    	address: address.address1
    });
    this.formValue.location = address;
  }

  onClickStart(){
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.form['controls'].start.setValue(convertedDate.momentDate.startOf('date'));
        this.startDate = convertedDate.stringDate.toUTCString();
    });
    modal1.present();
  }

  onClickEnd() {
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{ 
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.form['controls'].end.setValue(convertedDate.momentDate.endOf('date'));
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

  formatEventGroupDataToSave() {
      let that = this;
      return Observable.create(observer => {
        // let data = _.clone(this.form.value);
        // data['account'] = this.apiService.getAccount();
        // data['job'] = this.jobId;

        let data = that.formValueToEventGroup(this.form.value);
        observer.next(data);
        observer.complete();
        
      });
    }

    update(data) {
      console.log("update");
      return this.eventGroupService.save(data);
    }

    create(data) {
      console.log("create", data);
      return this.eventGroupService.save(data);
    }

    onSave(){

      this.validFlags = true;      

      if (this.form.invalid) {
        
        return;
      }

      let loading = this.loadingCtrl.create();
      loading.present();
      
      this.formatEventGroupDataToSave()
        .finally(() => { loading.dismiss(); })
        .subscribe((data) => {
            console.log("aaaaa");
            this[this.method](data).subscribe(
              result => {
                console.log("result", result);
                this.viewCtrl.dismiss();
              }
            );
          }, (err) => {
            console.error("error", err);
            // this.toast.show('failed', '2000', 'bottom');
          }
        );
   
      
    }

  	
	onClickClose(){
		this.viewCtrl.dismiss();
	}
  
  
}
