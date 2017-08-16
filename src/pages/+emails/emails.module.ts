import { NgModule }                          from '@angular/core';
import { IonicApp, IonicModule} from 'ionic-angular';
import { TagInputModule } from "ng2-tag-input";
import { CommonModule } from '@angular/common';
/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/* Components */
import { JobContactMailModal }                    from './job-contact-mail-modal/job-contact-mail-modal';
import { EmailTemplateModal } from "./email-template-modal/email-template-modal";
import { NewMailModal } from "./newmail-modal/newmail-modal";

import { NgProfileImgModule } from '../../components/profile-img';

import { EmailService } from "../../services/email";
import { EmailTemplateService } from "../../services/email-template";
import { EmailTypeService } from "../../services/email-type";

import { MessagingUiService } from './newmail-modal/messaging-ui.service';

@NgModule({
  declarations: [
    JobContactMailModal,
    EmailTemplateModal,
    NewMailModal
  ],
  imports: [
    CommonModule,
    TagInputModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgProfileImgModule,
    IonicModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    JobContactMailModal,
    EmailTemplateModal,
    NewMailModal
  ],
  providers: [
    EmailService,
    EmailTemplateService,
    EmailTypeService,
    MessagingUiService
  ]
})
export class EmailsModule {}
