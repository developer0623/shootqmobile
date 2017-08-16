import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { TabsControllerPage } from '../tabs-controller/tabs-controller';


@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html'
})
export class SlidePage {
	@ViewChild(Slides) slides: Slides;
	public continueFlag: boolean = false;
  public currentIndex: number = 0;

  constructor(public navCtrl: NavController) {

  }


  slideChanged(){
  	// this.currentIndex = this.slides.getActiveIndex();
  	// if(this.currentIndex ==2){
  	// 	this.continueFlag = true;
  	// } else {
  	// 	this.continueFlag = false;
  	// }
  }

  onNextSlide(){
    if(this.currentIndex<2){
      this.currentIndex++;
    }
  }

  onPrevSlide(){
    if(this.currentIndex>0){
      this.currentIndex--;
    }
  }

  continue(){
  	console.log("new Page");
    this.navCtrl.push(TabsControllerPage);
  }

}
