import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Contact } from '../../../models/contact';
import { ContactService } from "../../../services/contact";
import { TabsControllerPage } from "../../tabs-controller/tabs-controller";

@Component({
  selector: 'page-notification-settings',
  templateUrl: 'notification-settings.html'
})
export class NotificationSettingModal {
	
    public userphoto: string ='';
	  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
              public contactService: ContactService) {
        let userInfo = JSON.parse(localStorage.getItem('currentUser'));
        this.userphoto = userInfo.user_profile.avatar;
      
  	}

    onClickClose(){
      // this.viewCtrl.dismiss();
      this.navCtrl.setRoot(TabsControllerPage);
    }

  	
  
  
}
