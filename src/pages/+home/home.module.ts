import { NgModule }                          from '@angular/core';
import { IonicApp, IonicModule} from 'ionic-angular';
/* Modules */
import { BrowserModule } from '@angular/platform-browser';
/* Components */
import { DashboardPage }                    from './dashboard/dashboard';
import { FeedSettingModal } from './feed-settings/feed-settings';
import { NgProfileImgModule } from '../../components/profile-img';
import { NgActivityFeeedModule } from "../../components/activity-feed";

@NgModule({
  declarations: [
    DashboardPage,
    FeedSettingModal
  ],
  imports: [
  BrowserModule,
  NgProfileImgModule,
  NgActivityFeeedModule,
  IonicModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DashboardPage,
    FeedSettingModal
  ],
  providers: [
  ]
})
export class HomeModule {}
