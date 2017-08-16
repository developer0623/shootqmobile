import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ViewController, LoadingController, ModalController, NavParams, ToastController } from 'ionic-angular';
import { JobDetailPage } from '../job-detail-controller/job-detail-controller';
import { Contact } from '../../../models/contact';
import { Job } from '../../../models/job';
import { CalendarModalPage } from "../../../components/calendar-modal/calendar-modal";
import { NewCalendarModalPage } from "../../../components/new-datetimer/new-datetimer";
import { BaseAddress } from '../../../models/address';
import { ContactService } from "../../../services/contact";
import { ApiService } from '../../../services/api/api.service';
import { JobTypeService }              from '../../../services/job-type';
import { JobRoleService } from '../../../services/job-role';
import { JobService } from '../../../services/job';
import { JobList } from '../../../services/job/jobs';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import { EventGroup } from '../../../models/event-group';
import { JobContact } from '../../../models/job-contact';
import { datesIntervalValidator } from '../../../validators';

@Component({
  selector: 'page-job-add',
  templateUrl: 'job-add.html'
})
export class AddJobModal implements OnInit {
	contactOrderingTypes = [
    {key: 'ordering=first_name', name: 'ALL'},
    {key: 'ordering=-created', name: 'RECENT'},
  ]
  contactFilter = {
    contact_types: '',
    order: this.contactOrderingTypes[0].key,
    search: '',
  };
  public jobId : any;
  public contacts: Contact[]=[];
  public searchedcontacts: Contact[]=[];
  public contactID:any;
  public searchData: any = '';
  public searchFlag: boolean = true;
  public selectRole:number;
  public jobTypes:any = [];
  private roles: any[] = [];
  public job: Job;
  public validFlags: boolean = false;
  public primaryFlag: boolean = false;
  // public validFlags:any = {nameFlag: false, roleFlag: false, prCFlag: false, startFlag: false, endFlag: false, totalFlag: false};
  count = 0;

   public jobForm: FormGroup;
   private method: string = 'create';
   private jobContact: JobContact;

   public isLoading:boolean = false;
   public startDate: string;
   public endDate: string;

   static patchFormValue(form, data, markTouched: boolean = false) {
    form.patchValue(data);
    if (markTouched) {
      for (let control in data) {
        if (data.hasOwnProperty(control))
          form.controls[control].markAsTouched();
      }
      form.markAsDirty();
    }
  }


	  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
              public contactService: ContactService, private apiService: ApiService, private jobTypeService: JobTypeService, private jobService: JobService,
              private jobRoleService: JobRoleService, private jobList: JobList, private modalCtrl: ModalController, private fb: FormBuilder, private navParams: NavParams
              ) {


      this.jobId = this.navParams.get('jobId');

      if(this.jobId){
        this.job = this.jobList.getDetailedJob();        
      } else {
        this.job = this.navParams.get('job');
      }
      this.jobContact = _.first(_.get(this.job, 'job_contacts', [])) || {};
      this.method = this.jobId ? 'update' : 'create';

      
  	}

    ngOnInit() {
      // this.jobTypes = this.jobTypeService.getJobType();
      // if(this.jobTypes.length==0){
      //   this.gettingJobType();
      // }
      // this.getContacts();
      // this.gettingJobRole();

      this.initJobForm();

      // if (!this.job.id) {
      //   this.jobForm['controls'].main_event_group['controls'].to_be_determined.valueChanges.subscribe((to_be_determined) => {
      //     if (to_be_determined) {
      //       this.jobForm.controls.main_event_group.patchValue({start: null, end: null, all_day: false});
      //       this.jobForm['controls'].main_event_group['controls'].start.clearValidators();
      //       this.jobForm['controls'].main_event_group['controls'].end.clearValidators();
      //     } else {
      //       this.jobForm['controls'].main_event_group['controls'].start.setValidators(Validators.required);
      //       this.jobForm['controls'].main_event_group['controls'].end.setValidators(Validators.required);
      //     }
      //     this.jobForm['controls'].main_event_group['controls'].start.updateValueAndValidity();
      //     this.jobForm['controls'].main_event_group['controls'].end.updateValueAndValidity();
      //     this.jobForm.updateValueAndValidity();
      //   });
      // }

    }
    ngAfterViewInit() {
      this.initData();
    }

    initJobForm() {
      this.jobForm = this.fb.group({
        name: [
          this.job.name,
          Validators.compose([
            Validators.required,
            Validators.maxLength(200)
          ])
        ],
        job_type: [''],
        job_contact_role: [_.get(this.jobContact, 'roles[0]', ''), Validators.required]
      });
      if (!this.jobId) {
        let mainEventGroup = this.initMainEventForm();
        // EventGroup.setInitialStartTime(mainEventGroup);
        this.jobForm.addControl('main_event_group', mainEventGroup);
      } else {
        this.searchData = this.jobContact.name;
        // console.log("this.jobcotnacts", this.jobContact);
        this.searchFlag = false;
        this.selectRole = _.get(this.jobContact, 'roles[0].id');
      }
    }

    initMainEventForm(): FormGroup {
      return this.fb.group({
        address: [
          _.get(this.job, 'main_event_group.address', ''),
          Validators.compose([
            Validators.maxLength(200)
          ])
        ],
        location_name: [
        _.get(this.job, 'main_event_group.location_name', ''),
        Validators.compose([
          Validators.maxLength(120)
        ])
      ],
        location: this.job.main_event_group,
        start: [_.get(this.job, 'main_event_group.start', null)],
        end: [_.get(this.job, 'main_event_group.end', null)],
        all_day: [_.get(this.job, 'main_event_details.all_day', false)],
      }, {validator: datesIntervalValidator('start', 'end')});
    }

    patchForm(formName: string, values: any) {
      AddJobModal.patchFormValue(this[formName], values);
    }

    getJobTypes() {
      return this.jobTypeService.getList()
        .map(res => res.results.map(item => ({value: item.id, label: item.name})));
    }

    getContacts(){
      return this.contactService.getContactList(this.contactFilter).map((res, count) => res.page.map(contacts => (ContactService.newObject(contacts))));

    }

    initData() {
      let loading = this.loadingCtrl.create();
      loading.present();
      Observable.forkJoin([
        this.getJobTypes(),
        this.jobRoleService.getList().map(res => res.results.map(jobRole => (JobRoleService.newObject(jobRole)))),
        this.getContacts(),
      ]).finally(() => {  this.isLoading = true; loading.dismiss();})
        .subscribe(([jobTypes, jobRoles, contacts]: [any[], any[], any[]]) => {
          this.jobTypes = jobTypes;
          setTimeout(() => {
            this.patchForm('jobForm', _.pick(this.job, ['job_type']));
          });
          this.roles = jobRoles;
          console.log("thisroles", this.roles);
          this.contacts = contacts;
          this.isLoading = true;

        });
    }

    formatMainEventGroup() {
      return _.pick(
        this.jobForm.value['main_event_group'],
        'address', 'start', 'end', 'location');
    }

    formatJobDataToSave() {
      let that = this;
      return Observable.create(observer => {
        let data = _.clone(this.jobForm.value);
        if (!this.jobId) {
          data['main_event'] = _.clone(this.jobForm.controls['main_event_group'].value);
          data['main_event_group'] = this.formatMainEventGroup();
        }

        if(that.primaryFlag){
          data['external_owner'] = this.contactID;
        } else {
          data['external_owner'] = this.job.external_owner.id;
        }

       
        data['account'] = this.apiService.getAccount();
        
        data['job_contact'] = {
          id: this.jobContact.id,
          role: this.selectRole
        };
        observer.next(data);
        observer.complete();
        
      });
    }

    update(data) {
      console.log("update", data);
      return this.jobService.update(this.job.id, data);
    }

    create(data) {
      console.log("create", data);
      return this.jobService.create(data);
    }

    changeRole(event){
      let that = this;
         let job_role = this.roles.filter(function(role){
          if(role.id == that.selectRole) return role;

        });
      console.log(job_role);
      this.jobForm.controls.job_contact_role.patchValue(job_role[0]);
    }

  	onSave(){

      this.validFlags = true;
      // if(this.selectRole){
      //   let that = this;
      //   let job_role = this.roles.filter(function(role){
      //     if(role.id == that.selectRole) return role;

      //   });
        

        

      //   this.jobForm.controls.job_contact_role.patchValue(job_role[0]);
      // }

        

      if (this.jobForm.invalid || this.searchData == '') {
        
        return;
      }

      let loading = this.loadingCtrl.create();
      loading.present();
      
      this.formatJobDataToSave()
        .finally(() => { loading.dismiss(); })
        .subscribe((data) => {
            console.log("aaaaa");
            this[this.method](data).subscribe(
              result => {
                console.log("result", result);
                this.jobList.putSelectedJob(result);
                if(this.method =="update"){
                  this.viewCtrl.dismiss({refresh: true});
                } else {
                  this.viewCtrl.dismiss();
                  
                }
                

                // this.toast.show('success', '2000', 'bottom');
              },
              err=>{
                let errorToast = this.toastCtrl.create({
                  message: "failed",
                  duration: 2000,
                  position: 'center'
                });
                errorToast.present();
              },
              ()=>{

              }
            );
          }, (err) => {
            console.error("error", err);
            
          }
        );
   
  		
  	}


  onInput(ev){
    console.log("aaa");
    if(this.searchFlag){
      if(this.searchData && this.contacts){
        this.searchedcontacts = this.contacts.filter(this.searchFilter, this);
      } else {
        this.searchedcontacts = [];
      }
    } else {
      // if(this.count == 1){
      //   this.count = 0;
      // } else {
      //   this.searchFlag = true;
      // }
      this.searchFlag = true;
      
    }
      
    
  }

  searchFilter(contactItem){

    return contactItem.full_name.indexOf(this.searchData) > -1 ;
  }

  onSelectContact(selectedContact){
    this.searchFlag = false;
    this.count = 1;
    this.searchData = selectedContact.full_name;
    this.primaryFlag = true;
    this.contactID = selectedContact.id;
  }

	onClickClose(){
		this.viewCtrl.dismiss();
	}



  getAddress(event){
    let address = BaseAddress.extractFromGooglePlaceResult(event);
    this.jobForm.controls['main_event_group'].patchValue({
      address: address.address1,
      location: address
    });

  }

  onClickStart(){
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.jobForm['controls'].main_event_group['controls'].start.setValue(convertedDate.momentDate.startOf('date'));
        this.startDate = convertedDate.stringDate.toUTCString();
    });
    modal1.present();
  }

  onClickEnd() {
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{ 
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.jobForm['controls'].main_event_group['controls'].end.setValue(convertedDate.momentDate.endOf('date'));
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

  
  
  
}
