import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams} from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Moment } from "moment";


@Component({
  selector: 'page-newcal-modal',
  templateUrl: 'new-datetimer.html'
})
export class NewCalendarModalPage implements OnInit {

  field1: Moment;
  reactiveForm: FormGroup;
  constructor(private fb: FormBuilder, private viewCtrl: ViewController){
    this.reactiveForm = this.fb.group({field1:[this.field1]});
    this.reactiveForm.valueChanges.subscribe((changes) => {
      this.field1 = changes.field1;
    })
  }

  ngOnInit() {

  }

  onClickClose() {
    this.viewCtrl.dismiss();
  }

   onClickDone(){
     console.log("field", this.field1);
      
      // this.viewCtrl.dismiss();
  }
  
}
