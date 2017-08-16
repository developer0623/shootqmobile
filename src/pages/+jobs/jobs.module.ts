import { NgModule }                          from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
/* Components */
import { JobAddContactListpage } from './job-add-contact-list/job-add-contact-list';
import { JobsPage }                    from './joblist/joblist';
import { SearchjobPage }                    from './searchjob/searchjob';
import { SelectRolePopover }                    from './select-role-popover/select-role-popover';
import {JobDetailPage} from './job-detail-controller/job-detail-controller';
import { JobAddContactModal } from "./job-add-contact-modal/job-add-contact-modal";
import { JobEventGroupModal } from "./job-eventgroup-modal/job-eventgroup-modal";
import { AddJobModal } from "./job-add/job-add";
import { JobSettingModal } from "./job-settings/job-settings";
import { TaskAddModal } from "./task-add-modal/task-add-modal";
import { NewEventModal } from "./new-event/new-event";
import { GroupEventsComponent } from "./job-eventgroup-modal/group-events/group-events";
import { EventModalComponent } from "./job-eventgroup-modal/event-modal/event-modal";

import { NgJobItemModule } from "../../components/job-item";
import { NgProfileImgModule } from '../../components/profile-img';
// import { DropdownSelectModule } from '../../components/dropdown-select';
import { AutoCompleteModule } from "ionic2-auto-complete";
/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { GooglePlaceModule  } from '../../directives/google-place';
import { IonAlphaScrollModule } from '../../components/ionic2-alpha-scroll';

import { GeneralFunctionsService } from "../../services/general-functions";
import { AccessService } from "../../services/access";
import { JobService } from "../../services/job";
import { JobRoleService } from "../../services/job-role";
import { JobTypeService } from "../../services/job-type";
import { JobList } from "../../services/job/jobs";
import { EventTypeService } from "../../services/event-type";
import { EventGroupService } from '../../services/event-group';
import { EventService } from '../../services/event';
import { ContactService } from '../../services/contact';
import { JobContactService } from '../../services/job-contact';
import { JobNoteService } from "../../services/job-note";
import { Job } from "../../models/job";

import {ConstData} from "../../services/const";



@NgModule({
  declarations: [
    JobAddContactListpage,
    JobsPage,
    SearchjobPage,
    JobDetailPage,
    SelectRolePopover,
    JobAddContactModal,
    AddJobModal,
    JobEventGroupModal,
    GroupEventsComponent,
    EventModalComponent,
    JobSettingModal,
    NewEventModal,
    TaskAddModal
  ],
  imports: [
    NgJobItemModule,
    NgProfileImgModule,
    AutoCompleteModule,
    GooglePlaceModule,
    IonAlphaScrollModule,
    // DropdownSelectModule,
    BrowserModule,
    IonicModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    JobAddContactListpage,
    JobsPage,
    SearchjobPage,
    JobDetailPage,
    SelectRolePopover,
    JobAddContactModal,
    AddJobModal,
    JobEventGroupModal,
    EventModalComponent,
    JobSettingModal,
    NewEventModal,
    TaskAddModal
  ],
  providers: [
    GeneralFunctionsService,
    AccessService,
    JobService,
    JobRoleService,
    JobTypeService,
    JobList,
    EventTypeService,
    EventGroupService,
    EventService,
    ContactService,
    JobContactService,
    JobNoteService,
    Job,
    ConstData
  ]
})
export class JobsModule {}
