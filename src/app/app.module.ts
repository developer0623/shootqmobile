import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule, Slides} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { EmailComposer } from "@ionic-native/email-composer";
import { CallNumber } from "@ionic-native/call-number";
import { NativeGeocoder } from "@ionic-native/native-geocoder";

import { IonicStorageModule } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { NgCalendarModule } from '../components/ionic2-calendar';
import { MyApp } from './app.component';
import { SlidePage } from '../pages/slide/slide';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { NoteModalComponent } from "../components/note-modal/note-modal";
import { NgJobItemModule } from "../components/job-item";
import { NgProfileImgModule } from "../components/profile-img";



import { AddModalPage} from '../components/add-modal/add-modal';
import { CalendarModalPage } from '../components/calendar-modal/calendar-modal';
import { NewCalendarModalPage } from '../components/new-datetimer/new-datetimer';
import { GooglemapModalPage } from '../components/googlemap-modal/googlemap-modal';
import { ListPage } from '../pages/list/list';

import { AccessModule }  from '../pages/+access';
import { JobsModule } from '../pages/+jobs';
import { TasksModule } from '../pages/+tasks';
import { ContactsModule } from '../pages/+contacts';
import { EmailsModule } from '../pages/+emails';
import { HomeModule } from "../pages/+home";
import { NotificationsModule } from "../pages/+notifications";


// import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';

import { ConstData } from "../services/const";
import { ApiService } from "../services/api";
import { AccessService } from "../services/access";
import { SqDatetimepickerModule } from 'ngx-eonasdan-datetimepicker';
import { FormsModule, ReactiveFormsModule }                      from '@angular/forms';




@NgModule({
  declarations: [
    MyApp,
    CalendarModalPage,
    SlidePage,
    TabsControllerPage,
    AddModalPage,
    NewCalendarModalPage,
    NoteModalComponent,
    ListPage,
    GooglemapModalPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    NgCalendarModule,
    AccessModule,
    JobsModule,
    TasksModule,
    ContactsModule,
    EmailsModule,
    HomeModule,
    NgJobItemModule,
    NgProfileImgModule,
    NotificationsModule,
    SqDatetimepickerModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CalendarModalPage,  
    SlidePage,
    TabsControllerPage,
    AddModalPage,
    NewCalendarModalPage,
    NoteModalComponent,
    ListPage,
    GooglemapModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Slides,
    Toast,
    EmailComposer,
    ConstData,
    CallNumber,
    NativeGeocoder,
    ApiService,
    AccessService,
    // JobTypeService,
    // JobList,
    // RestClientService,
    {provide: ErrorHandler, useClass: IonicErrorHandler, useValue: undefined}
  ]
})
export class AppModule {}
