import { Component, Renderer } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-task-mark-modal',
  templateUrl: 'task-mark-modal.html'
})
export class TaskMarkModal {
	
	constructor(public navCtrl: NavController, public viewCtrl: ViewController, public renderer: Renderer) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }

  	
	onClickClose(){
		this.viewCtrl.dismiss();
	}
  
  
}
