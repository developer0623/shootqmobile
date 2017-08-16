import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/+access/login/login';
import { NotificationSettingModal } from '../pages/+notifications/notification-settings/notification-settings';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage: any = LoginPage;
  public userInfo : any = {};
  public menuFlag: boolean = false;
  public userphoto: string = '';

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
      // localStorage.removeItem('OAuthInfo');
      // localStorage.removeItem('ImpersonateOAuthInfo');
      // localStorage.removeItem('accountInfo');
      // sessionStorage.removeItem('refererUrl');
      // localStorage.removeItem('currentUser');
    this.initializeApp();
    if(this.getCanAccess()){
      // this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
      if(this.userInfo.user_profile){
        this.userphoto = this.userInfo.user_profile.avatar;
      } else {
        this.userphoto = 'assets/slideimage/img.png';
      }
      this.menuFlag = true;
      this.rootPage = TabsControllerPage;
    } else {
      this.listenToLoginEvents();
    }
    // this.listenToLoginEvents();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: TabsControllerPage },
      { title: 'Settings', component: NotificationSettingModal }
    ];

  }

  makingMenu() {
    
    
      // this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
      if(this.userInfo.user_profile){
        this.userphoto = this.userInfo.user_profile.avatar;
      } else {
        this.userphoto = 'assets/slideimage/img.png';
      }
      
      this.menuFlag = true;
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.makingMenu();
    });

    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.


      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  getoAuthInfo(): any {
    let oAuthRawInfo = localStorage.getItem('OAuthInfo');
    // if (this.router.url.indexOf('/public/client-access') === 0) {
    //   oAuthRawInfo = localStorage.getItem('ImpersonateOAuthInfo');
    // }
    return JSON.parse(oAuthRawInfo);
  }

  getCanAccess(): boolean {
    // let oAuthRawInfo = sessionStorage.getItem('OAuthInfo');
    // let oAuthInfo = JSON.parse(oAuthRawInfo);
    // return oAuthInfo !== undefined &&
    //   oAuthInfo !== null &&
    //   oAuthInfo.access_token !== undefined &&
    //   oAuthInfo.access_token !== null;

    let oAuthInfo = this.getoAuthInfo();
    // if (oAuthInfo && oAuthInfo.is_client_token && state) {
    //   return this.isClientArea(state);
    // }
    return oAuthInfo !== undefined &&
      oAuthInfo !== null &&
      oAuthInfo.access_token !== undefined &&
      oAuthInfo.access_token !== null &&
      !oAuthInfo.is_client_token;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
