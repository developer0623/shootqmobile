import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
// import { NavController, ViewController, ModalController} from 'ionic-angular';


// <img src="{{src}}" *ngIf="src"/>
//       <img src="assets/slideimage/img.png" *ngIf="!src"/>

@Component({
  selector: 'profile-img',
  template: `
    <div class="img-div">
      <div class="image-container">
        <img src="{{realSrc}}" />
      </div>
    </div>
      `
})
export class ProfileImg implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @Input() src: any;
  public realSrc: string;


 
  constructor(){
  }

  ngOnInit() {
  	if(!!this.src){
      this.realSrc = this.src;
    } else {
      this.realSrc = "../assets/slideimage/img.png";
    }
  } 
  
}
