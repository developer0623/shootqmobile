import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Component, ElementRef } from '@angular/core';
import { NavController, LoadingController, ViewController, ModalController, PopoverController, NavParams} from 'ionic-angular';
import { Contact } from '../../../models/contact';
import { Job, JobApiJobContact } from "../../../models/job";
import { ContactService } from "../../../services/contact";
import { JobContactService } from "../../../services/job-contact";
import { JobService } from "../../../services/job";
import { JobRoleService } from "../../../services/job-role";
import { GeneralFunctionsService } from "../../../services/general-functions";
import { SelectRolePopover } from "../select-role-popover/select-role-popover";
import { ConstData } from "../../../services/const";


@Component({
  selector: 'job-add-contact-list',
  templateUrl: 'job-add-contact-list.html'
})
export class JobAddContactListpage {
  
  currentPageClass = this;
  alphaScrollItemTemplate: string = `
    <ion-item class="contact-list-item" (click)="currentPageClass.onClickItem(item)">
      <p class="contact-list-title">{{item.full_name}}</p>
      <p class="contact-list-content">Client</p>
    </ion-item>
  `;
  triggerAlphaScrollChange: number = 0;
  public jobId: any;
  public jobData: Job = new Job();
  public isLoading: boolean = false;
  public contacts: Contact[]=[];
  private jobRoles: Array<any> = [];
  public searchedcontacts: Contact[]=[];
  public searchData: any = '';
  public contactCount: any;
  private contactsToAddIds: Array<number> = [];
  private selectedContacts: Array<any> = [];
  private contactsToRemoveIds: Array<number> = [];
  public isArchived: boolean = false;
  public loading: any;
  // contactOrderingTypes = [
  //   {key: 'ordering=first_name', name: 'ALL'},
  //   {key: 'ordering=-created', name: 'RECENT'},
  // ]
  // contactFilter = {
  //   contact_types: '',
  //   order: this.contactOrderingTypes[0].key,
  //   search: '',
  // };

  private sort = {
    sortedBy: 'last_name',
    nameAsc: true,
    dateCreatedAsc: true,
    emailAsc: true
  };
  private paginator = {
    totalItems: 100,
    currentPage: 1,
    perPage: 0,
  };

  constructor(public navCtrl: NavController, private viewCtrl: ViewController,
              public loadingCtrl: LoadingController,
              public contactService: ContactService,
              private generalFunctions: GeneralFunctionsService,
              private jobService: JobService, private jobContactService: JobContactService,
              private jobRoleService: JobRoleService, private elementRef: ElementRef,
              private modalCtrl: ModalController, private popoverCtrl: PopoverController, private navParams: NavParams, private constData: ConstData) {

    
    this.jobId = this.navParams.get('jobId');
    this.loadJobData();
  }

  

  cancelSearch() {
    this.searchData = '';
  }

  onInput(ev){
    if(this.searchData && this.contacts){
      this.searchedcontacts = this.contacts.filter(this.searchFilter, this);
    }
    
  }
  searchFilter(contactItem){

    return contactItem.full_name.toLowerCase().indexOf(this.searchData) > -1 ;
  }

  loadJobData(){
    this.loading = this.loadingCtrl.create({spinner: 'bubbles'});
    this.loading.present();
    this.jobService.get(this.jobId)
     .subscribe((data: Job) => {
       this.jobData = JobService.newObject(data);
       this.getRoles();
       this.getContacts(); 
     })
  }

  public getRoles() {
    this.isLoading = true;
    this.jobRoleService.getList()
      .subscribe(roles => {
        this.jobRoles = roles.results;
      });
  }


  
  

  public getContacts() {
    let o = this.generalFunctions.getSortOrderParam(this.sort);
    // let contactMissing = this.paginator.perPage * this.paginator.currentPage - this.paginator.totalItems;
    // if (contactMissing >= this.paginator.perPage) {
    //   this.paginator.currentPage -= 1;
    // }
    let params = {
      archived: this.isArchived,
      active: true,
      ordering: o.split('=')[1]
    };
    // let searchTerm = (this.searchTerm || '').trim();
    // if (searchTerm)
    //   params['search'] = searchTerm;

    // this.isLoading = true;

      
      this.contactService.getContactList(params)
        .subscribe(res => {
          this.loading.dismiss();
          this.contacts = res.page.sort(this.compare);
          this.contactCount = this.contacts.length;
          for (let contact of this.contacts) {
            let assocJobContact = _.find(this.jobData.job_contacts, {contact: contact.id});
            if (assocJobContact ||
              this.contactsToAddIds.indexOf(contact.id) !== -1)
              contact.selected = true;

            // Set roles
            contact.role = 0;
            if (assocJobContact && assocJobContact.roles.length > 0)
                contact.role = assocJobContact.roles[0].id;
          }
          
        },
        err => {
          this.loading.dismiss();
          
        },
        () => {
         
        });
  }

  compare(a, b){
    if(a.last_name.toLowerCase() < b.last_name.toLowerCase()){
      return -1;
    }
    if(a.last_name.toLowerCase() > b.last_name.toLowerCase())
      return 1;
    return 0;
  }


  

  // getContacts(){
  //   let loading = this.loadingCtrl.create({spinner: 'bubbles'});
  //   loading.present();
  //   this.contactService.getContactList(this.contactFilter)
  //       .subscribe(res => {
  //         loading.dismiss();
  //         this.contacts = res.page;
  //         this.contactCount = this.contacts.length;
  //         console.log("contacts", this.contacts);
          
  //       });

  // }

  

  onClickItem(item) {
    let that = this;
    this.triggerAlphaScrollChange++;
    let rolepopover = this.popoverCtrl.create(SelectRolePopover, {roles: this.jobRoles});
    rolepopover.onDidDismiss(data=>{
      if(data.selectedRole.id) {
        item.role = data.selectedRole.id;
        that.setSelected(item);
      }
      
    });
    rolepopover.present();
    // this.gotoContactDetail(item);

  }

  setSelected(contact: any){
    let inJobContacts = _.findIndex(this.jobData.job_contacts, {contact: contact.id}) !== -1;
    if (inJobContacts) {}
    else {

        
      this.contactsToAddIds.push(contact.id);
      this.selectedContacts.push(contact);
    }
  }
 unsetSelected(contact: any){
   let inJobContacts = _.findIndex(this.jobData.job_contacts, {contact: contact.id}) !== -1;
   if (_.includes(this.contactsToAddIds, contact.id))
      _.pull(this.contactsToAddIds, contact.id);
    if (inJobContacts)
      this.contactsToRemoveIds.push(contact.id);
    _.remove(this.selectedContacts, {id: contact.id});
 }

  onClickDone(){
    let that = this;
    let primary = this.jobData.primaryContact,
      validated = this.validate(),
      $subAddContacts = [], $subRemoveContacts = [];

      if (!validated)
      return;

    this.isLoading = true;

    for (let contactId of this.contactsToAddIds) {
      let contact = _.find(this.contacts, {id: contactId});
      $subAddContacts.push(this.addContact(contact));
    }

    for (let contactId of this.contactsToRemoveIds) {
      $subRemoveContacts.push(this.removeContact(contactId));
    }

    Observable
      .zip(...$subAddContacts, ...$subRemoveContacts)
      .subscribe(
        (jobContacts: JobApiJobContact[]) => {
          this.jobData.job_contacts.concat(jobContacts);
          // this.setPrimary(jobContacts[0].contact);
          that.viewCtrl.dismiss({refresh: true});
          
        },
        err => {
          console.error(err);
          this.isLoading = false;
        },
        () => { this.isLoading = false; }
      );
    
  }

  // public setPrimary(contact) {
  //   if (this.jobData.primaryContact)
  //     return;

  //   this.jobService
  //     .partialUpdate(this.jobData.id, {
  //       external_owner: contact
  //     })
  //     .subscribe(
  //       () => {},
  //       err => console.error(err),
  //       () => {
  //         this.isLoading = false;
  //       }
  //     );
  // }

  public validate() {
    let primaryContact = this.jobData.primaryContact,
      validated = true;

    if (primaryContact && _.includes(this.contactsToRemoveIds, primaryContact.id)) {
      this.constData.makingToast('Can\'t delete primary job contact.', 2000, 'top');
      validated = false;
    }

    for (let contactId of this.contactsToAddIds) {
      let contact = _.find(this.contacts, {id: contactId});
      if (!contact.role) {
        this.constData.makingToast(`Can\'t add ${contact.full_name} to the job. Job role is required.`, 2000, 'top');
        validated = false;
      }
    }

    return validated;
  }

  public addContact(contact) {
    return this.jobContactService
      .create({
        job: this.jobData.id,
        contact: contact.id,
        roles: [contact.role]
      });
  }

  public removeContact(contactId) {
    let jobContact = _.find(this.jobData.job_contacts, {contact: contactId}),
      contact = _.find(this.contacts, {id: contactId});

    contact.selected = false;
    if (!jobContact) {
      _.pull(this.contactsToRemoveIds, contact.id);
      return;
    }

    return this.jobContactService.delete(jobContact.id);
  }

  calculateScrollDimensions() {
    let screenHeight = document.documentElement.clientHeight;
    let ele = this.elementRef.nativeElement.querySelector('.sub-content');
    let top = 0, left = 0;
      // console.log("contentparent", ele.offsetParent);
    do {
      top +=ele.offsetTop || 0;
      ele = ele.offsetParent;
    } while(ele);
    return {
      height: screenHeight - top + 'px'
    }
  }

  onClickClose(){
    this.viewCtrl.dismiss({refresh: false});
  }

  
  
}
