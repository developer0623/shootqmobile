import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
// import { NavController, ViewController, ModalController} from 'ionic-angular';
import { ContactService } from '../../services/contact';
@Component({
  selector: 'contact-img',
  template: `
    <div class="img-div" *ngIf="isLoading">
      <div class="image-container" *ngIf="imageUrl">
        <img src="{{imageUrl}}" />
      </div>
      <p *ngIf="!imageUrl">{{singleName}}</p>
    </div>`
})
export class ContactImg implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @Input() src: any;
  @Input() name: string;
  @Input() id: number;
  

  public singleName: string='';
  public isLoading : boolean = false;
  public imageUrl: string = '';
 
  constructor(private contactService: ContactService){
  }

  ngOnInit() {
    let nameArray = this.name.split(' ');
    for(let ii = 0; ii<nameArray.length; ii++){
      this.singleName += nameArray[ii][0];
    }

    this.gettingphoto();
  	
  }
  gettingphoto(){
    this.contactService.getContact(this.id)
      .subscribe(
        contactData => {
          this.isLoading = true;
          this.imageUrl = contactData.avatar_url;
          },
        err => {
          this.isLoading = true;
          console.error(err);
          
        },
        () => {
         
        }
    );
  }
  
}
