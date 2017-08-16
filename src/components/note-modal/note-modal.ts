import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController, ViewController } from "ionic-angular";

@Component({
  selector: 'note-modal',
  templateUrl: 'note-modal.html'
})
export class NoteModalComponent  {
	
  public note: any ={subject:'', body:''};
  constructor( private navParams: NavParams, private viewCtrl: ViewController) {
  	this.note = this.navParams.get("note");
  }

  
  onSave() {
  	if(this.note.subject !='' && this.note.body !=''){
  		this.viewCtrl.dismiss({note: this.note});
    }
  	
  }

  onCancel() {
  	this.viewCtrl.dismiss({note:''});
  }

}
