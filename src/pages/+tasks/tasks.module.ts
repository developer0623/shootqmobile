import { NgModule }                          from '@angular/core';
import { IonicApp, IonicModule} from 'ionic-angular';
/* Components */
import { AssJobsPage }                    from './assjoblist/assjoblist';
import { TaskMarkModal } from "./task-mark-modal/task-mark-modal";
import {  NewTaskPage } from "./new-task-add/new-task-add";

import { BrowserModule } from '@angular/platform-browser';
import { NgJobItemModule } from "../../components/job-item";
import { MultiPickerModule } from '../../components/ion-multi-picker';
import { NgProfileImgModule } from '../../components/profile-img';


import { GeneralFunctionsService } from "../../services/general-functions";
import { AccessService } from "../../services/access";
import { JobService } from "../../services/job";
import { JobRoleService } from "../../services/job-role";
import { JobTypeService } from "../../services/job-type";
import { JobList } from "../../services/job/jobs";
import { Job } from "../../models/job";



@NgModule({
  declarations: [
    AssJobsPage,
    TaskMarkModal,
    NewTaskPage    
  ],
  imports: [
    NgJobItemModule,
    NgProfileImgModule,
    BrowserModule,
    MultiPickerModule,
    IonicModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AssJobsPage,
    TaskMarkModal,
    NewTaskPage    
  ],
  providers: [
    GeneralFunctionsService,
    AccessService,
    JobService,
    JobRoleService,
    JobTypeService,
    JobList,
    Job
  ]
})
export class TasksModule {}
