import { Component, Renderer } from '@angular/core';
import { NavController, ViewController, NavParams, ModalController } from 'ionic-angular';
// import { EmailComposer, EmailComposerOptions } from "@ionic-native/email-composer";
import { NewMailModal } from '../newmail-modal/newmail-modal';

@Component({
  selector: 'page-job-contact-mail',
  templateUrl: 'job-contact-mail-modal.html'
})
export class JobContactMailModal {
	public jobName: string = '';
	public jobId: any;
	public contact: any;
	
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private navParams: NavParams, public renderer: Renderer, private modalCtrl: ModalController) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
    this.jobName = this.navParams.get('jobName');
    this.contact = this.navParams.get('mainContact');
    this.jobId = this.navParams.get("jobid");
  }

  onNewEmail() {
  	let newmodal = this.modalCtrl.create(NewMailModal, {jobName: this.jobName, jobid:this.jobId, mainContact:this.contact});
  	newmodal.present();
  }

  	
	onClickClose(){
		this.viewCtrl.dismiss();
	}
  
  
}
