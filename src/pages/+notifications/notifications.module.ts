import { NgModule }                          from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
/* Components */
import { NotificationsPage }                    from './notifications-list/notifications-list';
import { NotificationSettingModal} from './notification-settings/notification-settings';

/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgProfileImgModule } from '../../components/profile-img';
import { NgActivityFeeedModule } from "../../components/activity-feed";





@NgModule({
  declarations: [
    NotificationsPage,
    NotificationSettingModal
  ],
  imports: [
    BrowserModule,
    NgProfileImgModule,
    NgActivityFeeedModule,
    IonicModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NotificationsPage,
    NotificationSettingModal
  ],
  providers: [
  ]
})
export class NotificationsModule {}
