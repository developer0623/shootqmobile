import { Component } from '@angular/core';
import { NavController, ModalController} from 'ionic-angular';
import { DashboardPage } from '../+home/dashboard/dashboard';
import { JobsPage } from '../+jobs/joblist/joblist';
import { AddModalPage } from '../../components/add-modal/add-modal';
import { ContactsListPage } from '../+contacts/contacts-list/contacts-list';
import { NotificationsPage } from '../+notifications/notifications-list/notifications-list';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = DashboardPage;
  tab2Root: any = JobsPage;
  tab4Root: any = ContactsListPage;
  tab5Root: any = NotificationsPage;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
  }

  onClickAdd(){
    let addModal = this.modalCtrl.create(AddModalPage);
    addModal.present();
  }
  
  // ionViewWillEnter(){
  //   this.tabbarElement.style.display = 'flex';
  // }

  // ionViewWillLeave(){
  //   this.tabbarElement.style.display = 'none';
  // }
}
