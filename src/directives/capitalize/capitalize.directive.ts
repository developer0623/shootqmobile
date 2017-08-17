import {Directive, HostListener, Renderer, ElementRef} from '@angular/core';
import {NgModel} from '@angular/forms';


@Directive({
  selector: '[capitalize]'
})
export class Capitalize {

  constructor(private renderer: Renderer, private el: ElementRef) {
    
  }

  @HostListener('keyup') onKeyUp(){
    // console.log(this.el.nativeElement);
    let value = this.el.nativeElement.children[0].value;
    let value1 = this.el.nativeElement.value;
    if(value)
    this.el.nativeElement.children[0].value = value[0].toUpperCase() + value.slice(1);

    if(value1)
      this.el.nativeElement.value = value1[0].toUpperCase() + value1.slice(1);
  }


  
}