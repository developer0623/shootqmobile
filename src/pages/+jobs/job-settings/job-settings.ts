import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Contact } from '../../../models/contact';
import { ContactService } from "../../../services/contact";

@Component({
  selector: 'page-job-settings',
  templateUrl: 'job-settings.html'
})
export class JobSettingModal {
	
  
	  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController,
              public contactService: ContactService) {

      
  	}

    onClickClose(){
      this.viewCtrl.dismiss();
    }

  	
  
  
}
