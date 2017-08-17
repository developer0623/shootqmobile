import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController, ViewController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import _ from "lodash";
import moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { BaseAddress } from '../../../models/address';
import { Contact } from '../../../models/contact';
import { ContactsUiService } from './contacts-ui.service';
import { ContactService } from "../../../services/contact";
import { JobRoleService }           from '../../../services/job-role';
import { CalendarModalPage } from "../../../components/calendar-modal/calendar-modal";


@Component({
  selector: 'page-contact-add',
  templateUrl: 'contact-add.html'
})
export class AddContactModal implements OnInit {

	private form: FormGroup;
	private contactFormContext;

  private isLoading: boolean = false;
  private isNewObject: boolean;
  private contact: Contact;
  private submitValue: any;

  public birthDate: string;
  public anniversaryDate: string;
   public validFlags: boolean = false;
   public method: string = "create";
   public jobflag: boolean= false;
   public selectedRole: any;
   private jobRoles: Array<any>= [];
  constructor(private navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController, public viewCtrl: ViewController, private loadingCtrl: LoadingController,
   @Inject(forwardRef(() => ContactsUiService)) private presenter: ContactsUiService, private contactService: ContactService, private jobRoleService: JobRoleService) {
    
    this.presenter = presenter;
    this.contact = this.navParams.get('contact');
    this.method =  this.contact.id ? 'update' : 'create';
    this.jobflag = this.navParams.get('jobFlag');
    if(this.jobflag) {
      this.getRoles();
    }
    this.form = ContactsUiService.createContactBasicDetailsForm();
  }

  ngOnInit(): void {
    console.log("bbbb");
    this.setViewValue(this.contact);
  }

  public getRoles() {
    let loading = this.loadingCtrl.create();
    loading.present();
    
    this.jobRoleService.getList()
      .subscribe(roles => {
        loading.dismiss();
        this.jobRoles = roles.results;
        
      });
  }

  getAddress(place){
    let address = BaseAddress.extractFromGooglePlaceResult(place);
    this.form.patchValue({
    	postalAddress: address.address1,
      	default_address: address
    });
  }

  changeFirstName(value){
    console.log("firstname", value);
    this.form.patchValue({
      firstName: value
    });
  }

  private setViewValue(contact: Contact) {
    // if (!contact.id || contact === Contact.Empty)
    //   return;
    this.isNewObject = !contact.id;
    this.presenter.createContactFormContext(Observable.of(contact))
      .subscribe(context => {
        // if(contact.id){
          console.log("aaaa");
          context.applyToForm(this.form);
          this.contactFormContext = context;
          this.resetSubmitValue();
        // } else {
        //   this.contactFormContext = context;
        // }
      },
      err=>{
        console.log("error", err);
      },
      ()=>{

      }

      );
  }

  private resetSubmitValue() {
    this.submitValue = this.contactFormContext.getFormSubmitValue(this.form);
    // let that = this;
    // return Observable.create(observer => {
    //   this.submitValue = _.clone(that.contactFormContext.getFormSubmitValue(this.form));
    //    observer.next(this.submitValue);
    //    observer.complete();
        
    // });
    // console.log("resumitvalue", this.submitValue);
  }

  onClickStart(){
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.form['controls'].birthday.setValue(convertedDate.momentDate.startOf('date'));
        this.birthDate = convertedDate.stringDate.toUTCString();
    });
    modal1.present();
  }

  onClickEnd() {
    let modal1 = this.modalCtrl.create(CalendarModalPage);
    modal1.onDidDismiss(data=>{ 
        let convertedDate = this.combineDateAndTime(data.selectedDate, data.selectTime);
        this.form['controls'].anniversary.setValue(convertedDate.momentDate.endOf('date'));
        this.anniversaryDate = convertedDate.stringDate.toUTCString();
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

  update(data) {
      // console.log("update");
      return this.contactService.update(data);
    }

    create(data) {
      // console.log("create", data);
      return this.contactService.create(data);
    }




  onSave(){

      this.validFlags = true;

      // console.log("formvalue",this.form.value);

      if (this.form.invalid) {
        
        return;
      }
      if(this.jobflag && !this.selectedRole){
        return;
      }

      let loading = this.loadingCtrl.create();
      loading.present();

      this.resetSubmitValue();

      this[this.method](this.submitValue).subscribe(
              result => {
                console.log("result", result);
                loading.dismiss();
                if(this.jobflag){
                  result.role = this.selectedRole;
                  this.viewCtrl.dismiss({contact: result});
                } else {
                  this.viewCtrl.dismiss({id: result.id});
                }
                
                
              },
              err => {
                let errorToast = this.toastCtrl.create({
                  message: "failed",
                  duration: 2000,
                  position: 'bottom'
                });
                errorToast.present();
                console.log("contact error", err);
                loading.dismiss();
              },
              ()=>{

              }
      );
   
      
  }

  // public addContact(contact) {
  //   contact.role = this.selectedRole;
  //   this.jobContactService
  //     .create({
  //       job: this.jobData.id,
  //       contact: contact.id,
  //       roles: [contact.role]
  //     });
  // }

    
  onClickClose(){
    this.viewCtrl.dismiss({id: false});
  }
  
 }
