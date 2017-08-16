import { Component, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import * as textClipper from 'text-clipper';
import { Observable, Subject } from 'rxjs';
import { SubscribableOrPromise } from 'rxjs/Observable';
import { NavController, ModalController, NavParams, Content, LoadingController, Events , ActionSheetController, AlertController} from 'ionic-angular';
import {  CallNumber } from "@ionic-native/call-number";

import {  TabsControllerPage } from '../../tabs-controller/tabs-controller';
import { AddJobModal } from '../job-add/job-add';
import { Job, JobApiJobContact }                     from '../../../models/job';
import { EventGroup } from '../../../models/event-group';
import { JobList }              from '../../../services/job/jobs';
import { JobService }              from '../../../services/job';
import { EventGroupService } from '../../../services/event-group';
import { GeneralFunctionsService } from '../../../services/general-functions';
import { JobNoteService } from "../../../services/job-note";
import { JobContactService }        from '../../../services/job-contact';

import { AddContactModal } from '../../+contacts/contact-add/contact-add';
import { JobAddContactModal } from "../job-add-contact-modal/job-add-contact-modal";
import { JobContactMailModal } from "../../+emails/job-contact-mail-modal/job-contact-mail-modal";
import { JobEventGroupModal } from "../job-eventgroup-modal/job-eventgroup-modal";
import { JobAddContactListpage } from '../job-add-contact-list/job-add-contact-list';
import { TaskAddModal } from "../task-add-modal/task-add-modal";
import { NoteModalComponent } from "../../../components/note-modal/note-modal";
import { GooglemapModalPage } from "../../../components/googlemap-modal/googlemap-modal";

import { BaseNote } from "../../../models/notes";
import { BaseUserProfile } from "../../../models/user";
import { JobNote } from "../../../models/job-note";
import { JobContact } from '../../../models/job-contact';

const ORIGINAL_PROPERTY_NAME = '$original';
const TRUNCATED_TEXT_INDICATOR = '&hellip;';
const DEFAULT_MAX_LINES_COUNT = 5;
const DEFAULT_MAX_WORDS_COUNT = 40;

@Component({
  selector: 'page-job-detail',
  templateUrl: 'job-detail-controller.html'
})
export class JobDetailPage implements OnDestroy{
  public segmentname: string = 'overview';

  public job: Job;
  public backFlag: boolean = false;
  public isLoading: boolean = false;
  public detailedJob: Job;
  private notes: JobNote[];

  public selectedSegment: string = 'overview';

  public noteChangeBuffer: BaseNote = BaseNote.Empty;
  public maxWords = DEFAULT_MAX_WORDS_COUNT;
  public maxLines = DEFAULT_MAX_LINES_COUNT;
  private destroyed = new Subject<void>();

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private modalCtrl: ModalController,
    private events: Events,  private alertCtrl: AlertController,  private actionSheetCtrl: ActionSheetController, private callNumber: CallNumber,
    private eventGroupService: EventGroupService, private generalFunctions: GeneralFunctionsService, private jobNoteService: JobNoteService,
   public jobListService: JobList, private navParams: NavParams,  private jobService: JobService, private jobContactService: JobContactService) {
    this.job = this.jobListService.getSelectedJob();
    this.backFlag = this.navParams.get('back');
    
    this.getDetailedJob();
    this.getJobNotes();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onShowMap(address){
    if(address) {
      let modal = this.modalCtrl.create(GooglemapModalPage, {address: address});
      modal.present();
    }
  }


  segmentChanged(event) {
    this.selectedSegment = this.segmentname;
  }

  onEditJob(){
  	let editModal = this.modalCtrl.create(AddJobModal, {jobId: this.job.id});
  	editModal.onDidDismiss(data=>{
      // if(data.refresh)
      // this.navCtrl.push(JobDetailPage);
    });
  	editModal.present();
  }

  onClickBack(){
    this.navCtrl.setRoot(TabsControllerPage);
  }

  getDetailedJob(){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.jobService.get(this.job.id)
    .subscribe(
      jobData => {
        this.isLoading = true;
        // this.detailedJob = jobData;
        // console.log("detailedJob", jobData);
        this.resetJob(jobData);
        loading.dismiss();
      },
      err =>{
        console.log("error", err);
        this.isLoading = true;
        loading.dismiss();
      },
      () => {

      });
  }

  private resetJob(jobData: any) {
    this.detailedJob = JobService.newObject(jobData);
    console.log("detailedjob",this.detailedJob);
    
    this.detailedJob.job_contacts = _.map(this.sortedJobContacts(this.detailedJob), item => {
      return Object.assign(new JobApiJobContact(), item);
    });

    this.jobListService.setDetailedJob(this.detailedJob);
  }


   public sortedJobContacts(job: Job): JobApiJobContact[] {
    let contacts = _(job.job_contacts)
      .filter(item => !job.isPrimaryJobContact(item))
      .sortBy(['created'])
      .value();
    let primaryContact = job.primaryContact;
    if (primaryContact)
      contacts.unshift(primaryContact);
    return contacts;
  }

  refreshJob(){
    this.events.subscribe('detailJob:refresh', () => {
      this.getDetailedJob();
    });
  }


  onClicknewEventGroup(){
    let newEventGroup = this.modalCtrl.create(JobEventGroupModal, { jobId: this.detailedJob.id, editflag: false, eventgroup: {} });
    newEventGroup.onDidDismiss(data=> {
      // this.events.publish('detailJob:refresh');
      this.getDetailedJob();
    });
    newEventGroup.present();
  }

  openPhoneCall(contact) {
    this.callNumber.callNumber(contact.default_phone_number, true);
  }

  openEmailModal(contact){
    let newEmailModal = this.modalCtrl.create(JobContactMailModal, { jobName: this.detailedJob.name, jobid:this.detailedJob.id, mainContact:contact });
    newEmailModal.present();
  }

  onClickNewContact(){
    

    let newContactModal = this.modalCtrl.create(JobAddContactModal, { jobId: this.detailedJob.id });
    newContactModal.onDidDismiss(data=>{
      if(data.page == 1){
        let contactListModal = this.modalCtrl.create(JobAddContactListpage, { jobId: this.detailedJob.id});
        contactListModal.onDidDismiss(data=>{
          if(data.refresh){
            // this.events.publish('detailJob:refresh');
            this.getDetailedJob();
          }
        });
        contactListModal.present();
      } else if(data.page == 2){
        let addModal = this.modalCtrl.create(AddContactModal, {contact: {}, jobFlag: true});
        addModal.onDidDismiss(data=> {
          // console.log("new contact", data);
          this.addContact(data.contact);
        });
        addModal.present();
      }
    });
    newContactModal.present();
  }


  addContact(contact) {
    this.jobContactService.create({job: this.detailedJob.id, contact: contact.id, roles: [contact.role]})
    .subscribe((data)=> {
      this.setPrimary(contact);
      this.getDetailedJob();
      // this.detailedJob.job_contacts.push(
      //   Object.assign(new JobApiJobContact(), data)
      // );
      // console.log("new contact", contact);
      // console.log("new contact", data);
      // console.log("new contact1", Object.assign(new JobApiJobContact(), data));
    }, err => {
       console.log("addcontact error", err);
    },
    ()=>{

    });
  }


  setPrimary(contact) {
    if (this.detailedJob.primaryContact)
      return;

    this.jobService
      .partialUpdate(this.detailedJob.id, {
        external_owner: contact
      })
      .subscribe(
        () => {},
        err => console.error(err),
        () => {
        }
      );
  }













  onClickEventGroup(eventGroup) {
    console.log("eventGroup", eventGroup);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Edit",
          handler: () =>{
            this.onEditEventGroup(eventGroup);
          }
        },
        {
          text: "Delete",
          handler: () => {
            this.makingAlert("Are you sure that you want to delete this?", false, eventGroup);
          }
        },
        {
          text: "Set as the main event",
          handler: () => {
            this.makingAlert("Are you sure that you want to set this as main?", true, eventGroup);
          }
        }
      ]
    });
    actionSheet.present();
  }

  onEditEventGroup(eventGroup){
    let newEventGroup = this.modalCtrl.create(JobEventGroupModal, { jobId: this.detailedJob.id, editflag: true, eventgroup: eventGroup });
    newEventGroup.onDidDismiss(data=> {
      // this.events.publish('detailJob:refresh');
      this.getDetailedJob();
    });
    newEventGroup.present();
  }

  makingAlert(message, flag, eventGroup){
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
            if(flag) {
              this.setMainEventGroup(eventGroup);
            } else {
              this.deleteGroup(eventGroup);
            }

          }
        }

      ]
    });
    alert.present();
  }

  deleteGroup(group: EventGroup) {
      this.eventGroupService.delete(group.id).subscribe(() => {
        this.getDetailedJob();
        // this.events.publish('detailJob:refresh');
        // let index = this.detailedJob.eventgroups.findIndex(g => g.id === group.id);
        // let isMainEvent = this.detailedJob.main_event_group &&
        //   this.detailedJob.main_event_group.id === this.detailedJob.eventgroups[index].id;
        // this.detailedJob.eventgroups.splice(index, 1);
        // // if the main event is deleted emit the mainEventChanged with the empty Event
        // if (isMainEvent)
        //   this.mainEventChanged.emit(Event.Empty);
      });
  }



  setMainEventGroup(group: EventGroup) {
    
      let data = {main_event_group: group};
      this.jobService.partialUpdate(this.detailedJob.id, data).subscribe((job) => {
        this.getDetailedJob();
        // this.events.publish('detailJob:refresh');
        // _.assign(this.job, _.pick(job, 'main_event_group', 'main_event_date'));
        // this.mainEventChanged.emit(EventService.newObject(job.main_event_group));
      });
  }


  onClickAdd(){
    let addmodal = this.modalCtrl.create(TaskAddModal, {jobId: this.detailedJob.id});
    addmodal.onDidDismiss(data=>{
      this.getDetailedJob();
    });
    addmodal.present();
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
    let note = new JobNote(data.id, data.subject, data.body, this.job.id);
    let isNewObject = !note.id;
    let request = isNewObject ? this.jobNoteService.create(note) :
        this.jobNoteService.update(note.id, note);
    //noinspection JSIgnoredPromiseFromCall
    request.takeUntil(this.destroyed)
      .subscribe(
        response => {
          if(index == 0)
          this.notes.splice(0, 0, response);
        else this.notes[index] = response;
          console.log("note success", response);
        },
        err => {
          console.log("note error", err);
        }
      );
  }


   private getJobNotes(): Observable<any> {
    // this.notesLoading = true;
    let result = this.jobNoteService.getListByJob(this.job.id);
    //noinspection JSIgnoredPromiseFromCall
    result.takeUntil(this.destroyed)
      .subscribe(
        response => {
          this.notes = response.jobNotes || [];
          console.log("this.notes", this.notes);
          // this.paginator.totalItems = response.total;
          
        },
        err => {
          console.error(err);
          
        },
        () => {
          // this.notesLoading = false;
        }
      );
    return result;
  }


  private deleteNotes(notes: JobNote[], index) {
    let loading = this.loadingCtrl.create();
    loading.present();
    let requests: SubscribableOrPromise<JobContact>[] = _(notes)
      .map(item => {
        return this.jobNoteService.delete(item.id);
      })
      .value();
    if (!requests.length)
      return;

    
      Observable.forkJoin(requests)
        .takeUntil(this.destroyed)
        .subscribe(() => {
            this.notes.splice(index, 1);
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
