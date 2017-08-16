import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {  CallNumber } from "@ionic-native/call-number";
import * as _ from 'lodash';
import * as textClipper from 'text-clipper';
import { Observable, Subject } from 'rxjs';
import { SubscribableOrPromise } from 'rxjs/Observable';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';


import { AddContactModal } from "../contact-add/contact-add";
import { JobContactMailModal } from "../../+emails/job-contact-mail-modal/job-contact-mail-modal";
import { Contact } from '../../../models/contact';

import { ApiService } from '../../../services/api/';
import { ContactService } from '../../../services/contact';
import { JobTypeService } from '../../../services/job-type';
import { JobService } from '../../../services/job/job.service';
import { ActivityService } from '../../../services/activity/activity.service';

import { ContactNote } from '../../../models/contact-note';
import { BaseNote } from '../../../models/notes';
import { AccessService } from '../../../services/access/access.service';
import { ContactNoteService } from '../../../services/contact-note/contact-note.service';
import { BaseUserProfile } from "../../../models/user";
import { GeneralFunctionsService } from '../../../services/general-functions';

import { NoteModalComponent } from "../../../components/note-modal/note-modal";


const ORIGINAL_PROPERTY_NAME = '$original';
const TRUNCATED_TEXT_INDICATOR = '&hellip;';
const DEFAULT_MAX_LINES_COUNT = 5;
const DEFAULT_MAX_WORDS_COUNT = 40;

@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail-controller.html'
})

export class ContactDetailPage implements OnInit, OnDestroy {
  public contact: Contact = Contact.Empty;
  public contactId:any;
  public profileEditFlag: boolean = true;
  public authorized: boolean = false;
  // private contact: Contact;
  private uploader: FileUploader = new FileUploader({});
  public tabParam:any = {};

  public isLoading: boolean = false;

  private destroyed = new Subject<void>();
  public selectedSegment: string = 'jobs';
  public segmentname: string = 'jobs';

  public contactJobs: Array<any> = [];
  public jobTypes: any;
  public contactActivities: Array<any> = [];


  private contactNotes: ContactNote[];
    private notesLoading: boolean = true;
    private notesPaginator = {
      totalItems: 0,
      currentPage: 1,
      perPage: null,
  };


  public noteChangeBuffer: BaseNote = BaseNote.Empty;
  public maxWords = DEFAULT_MAX_WORDS_COUNT;
  public maxLines = DEFAULT_MAX_LINES_COUNT;

  public loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: ApiService, 
    private transfer: Transfer, private contactService: ContactService, public loadingCtrl: LoadingController, private callNumber: CallNumber,
    private modalCtrl: ModalController, private jobTypeService: JobTypeService,  private activityService: ActivityService,
    private accessService: AccessService, private contactNoteService: ContactNoteService, private generalFunctions: GeneralFunctionsService) {
    

    this.contactId = this.navParams.get('contactId');
    this.tabParam = {id:this.contactId};
    this.uploader = new FileUploader({
      url: this.apiService.apiUrl + '/storage/upload/' + this.apiService.auth.id + '/',
      authToken: this.apiService.getOauthAutorization()
    });

    this.getContactInfo();

  }

  ngOnInit(){
    this.jobTypes = this.jobTypeService.getJobType();
      // console.log("jobtypes", this.jobTypes);
      if(this.jobTypes.length == 0){
        this.gettingJobType();
      } else {
         this.getContactJobs();
      }

      // this.getContactActivity();
      this.loadFeed();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  segmentChanged(event) {
    this.selectedSegment = this.segmentname;
  }

  public getContactInfo() {

    this.loading = this.loadingCtrl.create({spinner: 'bubbles'});
    this.loading.present();
    this.contactService.getContact(this.contactId)
      .subscribe(
        contactData => { // Get response from the contact endpoint.
          this.contact = ContactService.newObject(contactData);
          console.log('contact', this.contact);
          
          // cache the website name
          this.contact['$websiteDisplayName'] = this.contact.websiteDisplayName;
          this.contact['$websiteUrl'] = this.contact.websiteUrl;
          this.contact['$facebookId'] = this.contact.facebookUserId;
          this.contact['$twitterId'] = this.contact.twitterUserId;
          this.contact['$instagramId'] = this.contact.instagramUserId;
          this.contact['$hasSocialProfiles'] = this.contact.hasSocialProfiles;
          this.authorized = true;
          // Format contact data.
          this.resetViewValue(this.contact);

        },
        err => {
          this.loading.dismiss();
          console.error(err);
          
        },
        () => {
         
        }
      );
  }

  openEmailModal() {
    let newEmailModal = this.modalCtrl.create(JobContactMailModal, { jobName: '', email:this.contact.defaultEmail });
    newEmailModal.present();
  }

  openPhoneCall() {
    this.callNumber.callNumber(this.contact.defaultPhoneNumber, true);
  }

  onClickProfileImg() {
    this.profileEditFlag = !this.profileEditFlag;
  }

  onClickBack(){
  	this.navCtrl.pop();
  }
  onFileChange(event) {
    let hasError;

    if (event.target.files.length === 0) {
      this.uploader.clearQueue();
    }

   

    // this.isLoading = true;
    for (let fileItem of this.uploader.queue) {
      fileItem.withCredentials = false;
      fileItem.upload();
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      let json = JSON.parse(JSON.parse(response));
      console.log("json",json);
      this.contact.avatar = json.file_id;
      this.update(this.contact);
    };
  }

  validateFiles(files: Object[], types: string[], maxsize: number = 10000000): boolean {
    for (let file of files) {
      if (file['size'] > maxsize || types.indexOf(file['type']) === -1)
        return true;
    }
    return false;
  }

  public update(data) {
    this.contactService.update(data)
      .subscribe(response => {
          this.getContactInfo();
          console.log("success");
        },
        err => {
          console.error(err);
          
        }
      );
  }

  onClickEdit() {
    let editModal = this.modalCtrl.create(AddContactModal, {contact: this.contact, jobFlag: false});
    editModal.onDidDismiss(data=>{
      if(data.id){
        this.contactId = data.id;
        this.getContactInfo();
      }
      
    });
    editModal.present();

  }



  // contact-jobs

  gettingJobType(){
    this.jobTypeService.getList()
      .subscribe(types => {
        this.jobTypes = types.results;
        this.jobTypeService.setJobType(this.jobTypes);
        this.getContactJobs();
    });
  }

  public getContactJobs() {    
    this.contactService.getContactJobs(this.contactId)
      .subscribe(
        data => { // Get response from the contact endpoint.

          this.contactJobs = data;
          
          console.log("data", data);

        },
        err => {
          console.error(err);
          
        }
    );
  }

  loadFeed() {
    // let args = [];
    // if (this.contentType && this.target)
    //   args = [this.contentType, this.target];

    // this.isLoading = false;
    // this.activityService[this.type](...args)
    //   .subscribe(
    //     (results) => {
    //       this.feed = results.items;
    //       this.isLoading = true;
    //     },
    //     (errors) => {
    //       console.error(errors);
    //     },
    //     () => { this.isLoading = true; }
    //   );
  }

// contact note

  private resetViewValue(contact: Contact) {
      if (!contact || contact === Contact.Empty)
        return;
      this.notesLoading = true;
      let params = {
        ordering: '-created',
        page_size: this.notesPaginator.perPage,
        page: this.notesPaginator.currentPage
      };
      this.contactNoteService.getListByContact(contact.id, params)
        .finally(() => this.notesLoading = false)
        .subscribe(
          response => {
            this.contact = _.cloneDeep(contact);
            this.contactNotes = response.contactNotes;
            this.getNotesContacts(this.contactNotes);
            this.notesPaginator.totalItems = response.total;

            this.loading.dismiss();
            this.isLoading = true;
            
          },
          console.error.bind(console));
    }

    /**
   * Function to get contact full name associated to a note (user profile)
   * by replacing created_by / last_modified_by field on note object.
   * @param {[type]} notes [description]
   */
  private getNotesContacts(notes: Array<ContactNote>) {
    if (notes) {
      for (let note of notes) {
        if (note.created_by !== undefined && note.created_by !== null) {
          this.accessService.getUserProfileInfo()
            .subscribe(
              currentUser => {
                note.created_by = currentUser.fullName;
              },
              console.error.bind(console)
            );
        }
        if (note.last_modified_by !== undefined && note.last_modified_by !== null) {
          this.accessService.getUserProfileInfo()
            .subscribe(
              currentUser => {
                note.last_modified_by = currentUser.fullName;
              },
              console.error.bind(console)
            );
        }
      }
    }
  }


  onClickNewNote(note: BaseNote, index) {
    
    if(_.isNull(note)){
      note = new BaseNote(0, '', ' ');
      let currentUserSub = Object.assign(new BaseUserProfile(), {name:"N/A"});
      note.created_by_data = currentUserSub;
      note.last_modified_by_data = currentUserSub;
    }

    this.noteChangeBuffer = _.cloneDeep(note);
    this.noteChangeBuffer[ORIGINAL_PROPERTY_NAME] = note;

    let newnote = {subject:note.subject, body:note.body};
    let noteModal = this.modalCtrl.create(NoteModalComponent, {note: newnote});
    noteModal.onDidDismiss(data=>{
      let origianl  = this.noteChangeBuffer[ORIGINAL_PROPERTY_NAME];
      let hasChanged = origianl.subject !== data.note.subject || origianl.body !== data.note.body;
      if(hasChanged && data.note) {
        delete this.noteChangeBuffer[ORIGINAL_PROPERTY_NAME];
        Object.assign(this.noteChangeBuffer, data.note);
        // console.log("this.notechangebuffer", this.noteChangeBuffer);
        // console.log("note", data.note);
        this.resetNote(this.noteChangeBuffer);
        Object.assign(origianl, this.noteChangeBuffer);
        this.saveNote(this.noteChangeBuffer, index);
      }
      

    });
    noteModal.present();

  }

  private resetNote(note: BaseNote): BaseNote {
    let lines = note.body.toLocaleLowerCase().replace(/<br>/g, '\n').split('\n');
    let words = _.words(this.generalFunctions.removeHtmlTags(note.body));
    let maxCharCount = _.take(words, this.maxWords).join(' ').length;
    note['$isLongNote'] = words.length > this.maxWords || lines.length > this.maxLines;
    note['$isExpanded'] = !note['$isLongNote'];
    note['$body'] = note.body;
    note['$truncatedBody'] = textClipper(note.body, maxCharCount,
      {html: true, indicator: TRUNCATED_TEXT_INDICATOR, maxLines: this.maxLines});
    note['$modifiedByDisplayName'] = note.last_modified_by_data.name;
    note['$createdByDisplayName'] = note.created_by_data.name;
    return note;
  }

  private saveNote(data: BaseNote, index) {
    let note = new ContactNote(data.id, data.subject, data.body, this.contact.id);
    let isNewObject = !note.id;
    let request = isNewObject ?
      this.contactNoteService.create(note) :
      this.contactNoteService.update(note.id, note);
    request.takeUntil(this.destroyed)
    .subscribe(
      response => {
        if(index == 0)
          this.contactNotes.splice(0,0, response);
        else this.contactNotes[index] = response;
      },
      err => {
        console.error(err);
        
      }
    );
  }

  private deleteNotes(notes: ContactNote[], index) {
    let loading = this.loadingCtrl.create();
    loading.present();
    let requests: SubscribableOrPromise<ContactNote>[] = _(notes)
      .map(item => {
        return this.contactNoteService.delete(item.id);
      })
      .value();
    if (!requests.length)
      return;

   
      Observable.forkJoin(requests)
        .subscribe(() => {
            this.contactNotes.splice(index, 1);
            loading.dismiss();
          },
          err => {
            loading.dismiss();
          },
          () => {
            
          }
        );
    
  }






}
