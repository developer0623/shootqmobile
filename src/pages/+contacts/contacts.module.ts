import { NgModule }                          from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
/* Components */
import { ContactsListPage }                    from './contacts-list/contacts-list';
// import { ContactJobsPage } from './contact-jobs/contact-jobs';
// import { ContactNotePage} from './contact-note/contact-note';
import { ContactDetailPage } from './contact-detail-controller/contact-detail-controller';
import { AddContactModal } from './contact-add/contact-add';
import { ContactSettingModal } from './contact-settings/contact-settings';



import { BrowserModule } from '@angular/platform-browser';
import { IonAlphaScrollModule } from '../../components/ionic2-alpha-scroll';
import { NgProfileImgModule } from '../../components/profile-img';
import { NgJobItemModule } from '../../components/job-item';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { GooglePlaceModule  } from '../../directives/google-place';

import { GeneralFunctionsService } from "../../services/general-functions";
import { AccessService } from "../../services/access";
import { ContactService } from "../../services/contact";
import { ContactNoteService } from "../../services/contact-note";

import { FileSelectDirective } from 'ng2-file-upload';
import { ContactsUiService } from './contact-add/contacts-ui.service';
import { EmailTypeService } from '../../services/email-type/email-type.service';
import { PhoneTypeService } from '../../services/phone-type/phone-type.service';
import { JobRoleService } from '../../services/job-role/job-role.service';
import { ActivityService } from '../../services/activity/activity.service';



/* Directives */
@NgModule({
  declarations: [
    ContactsListPage,
    ContactDetailPage,
    AddContactModal,
    ContactSettingModal,
    // ActivityItemComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    IonAlphaScrollModule,
    NgProfileImgModule,
    NgJobItemModule,
    GooglePlaceModule,
    IonicModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ContactsListPage,
    ContactDetailPage,
    AddContactModal,
    // ActivityItemComponent,
    ContactSettingModal
  ],
  providers: [
    GeneralFunctionsService,
    AccessService,
    ContactService,
    ContactNoteService,
    ContactsUiService,
    
    EmailTypeService,
    PhoneTypeService,
    JobRoleService,
    ActivityService,
    Transfer,Camera
  ]
})
export class ContactsModule {
}
