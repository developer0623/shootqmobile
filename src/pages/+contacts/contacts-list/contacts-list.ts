import { Component } from '@angular/core';
import { NavController, LoadingController, App, ModalController} from 'ionic-angular';
import { Contact } from '../../../models/contact';
import { ContactService } from "../../../services/contact";
import { GeneralFunctionsService } from "../../../services/general-functions";

import { ContactDetailPage } from "../contact-detail-controller/contact-detail-controller";
import { ContactSettingModal } from '../contact-settings/contact-settings';

@Component({
  selector: 'page-contacts-list',
  templateUrl: 'contacts-list.html'
})
export class ContactsListPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tabbarElement: any;
  public userphoto: string ='';
  currentPageClass = this;
  // alphaScrollItemTemplate: string = `
  //   <ion-item class="contact-list-item" (click)="currentPageClass.onItemClick(item)">
  //     <p class="contact-list-title">{{item.full_name}}</p>
  //     <p class="contact-list-content">Client</p>
  //   </ion-item>
  // `;
  alphaScrollItemTemplate: string = `
    <ion-item class="contact-list-item" (click)="currentPageClass.onItemClick(item)">
      <p class="contact-list-title">{{item.full_name}}</p>
    </ion-item>
  `;
  triggerAlphaScrollChange: number = 0;
  public contacts: Contact[]=[];
  public searchedcontacts: Contact[]=[];
  public searchData: any = '';
  public contactCount: any;

  public isArchived: boolean = false;
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

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public contactService: ContactService,
              private generalFunctions: GeneralFunctionsService,
              private modalCtrl: ModalController) {

    let userInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.userphoto = userInfo.user_profile.avatar;
  	this.getContacts();
    this.tabbarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter(){
    this.tabbarElement.style.display = 'flex';
  }

  // ionViewWillLeave(){
    
  // }

  onClickProfile(){
    console.log("aaaaaa");
  }


  onClickSetting() {
    let settingModal = this.modalCtrl.create(ContactSettingModal);
    settingModal.present();
  }

  cancelSearch() {
  	this.searchData = '';
  }

  onInput(ev){
    if(this.searchData && this.contacts){
      this.searchedcontacts = this.contacts.filter(this.searchFilter, this);
    }
    
  }
  gotoContactDetail(contact: any){
    this.tabbarElement.style.display = 'none';
    this.navCtrl.push(ContactDetailPage, {contactId: contact.id});
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

      let loading = this.loadingCtrl.create({spinner: 'bubbles'});
    loading.present();
      this.contactService.getContactList(params)
        .subscribe(res => {
          loading.dismiss();
          this.contacts = res.page.sort(this.compare);
          this.contactCount = this.contacts.length;
          console.log("contacts", this.contacts);
          
        },
        err => {
          loading.dismiss();
          
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

  searchFilter(contactItem){

    return contactItem.full_name.toLowerCase().indexOf(this.searchData) > -1 ;
  }

  onItemClick(item) {
    this.triggerAlphaScrollChange++;
    this.gotoContactDetail(item);

  }

  
  
}
