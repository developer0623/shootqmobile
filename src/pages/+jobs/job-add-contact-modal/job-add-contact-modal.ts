import { Component, Renderer } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-job-add-contact',
  templateUrl: 'job-add-contact-modal.html'
})
export class JobAddContactModal {
  private jobId: any;
	
	constructor(public navCtrl: NavController, public viewCtrl: ViewController, public renderer: Renderer, private navParams: NavParams) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
    this.jobId = this.navParams.get("jobId");
  }

  onJobContactList() {
  	this.viewCtrl.dismiss({page: 1});
  	
  }


  onJobNewContact() {
    this.viewCtrl.dismiss({page: 2});
  }

  	
	onClickClose(){
		this.viewCtrl.dismiss();
	}
  
  
}
