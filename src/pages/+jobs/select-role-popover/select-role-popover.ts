import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'select-role-popover',
  templateUrl: 'select-role-popover.html'
})
export class SelectRolePopover {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  public roles: any;
  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
  	this.roles = this.navParams.get('roles');
  }

  onSelectRole(role){
    this.viewCtrl.dismiss({selectedRole: role});
  }
  
}
