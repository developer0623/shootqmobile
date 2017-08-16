import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController} from 'ionic-angular';

import { TaskMarkModal } from "../../+tasks/task-mark-modal/task-mark-modal";
import { CalendarModalPage } from "../../../components/calendar-modal/calendar-modal";
import { FeedSettingModal } from '../feed-settings/feed-settings';

import { EventGroup } from '../../../models/event-group';
import { EventGroupService } from '../../../services/event-group';
import { EventGroupFilterParams, EventGroupFilter } from './group-event-filter.model';
import { DashboardSchedule } from './schedule.model';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit{
  // this tells the tabs component which Pages
  // should be each tab's root Page
  public  weeklist: any = [];
  public userphoto : string = '';
  public overudeTasks: any = [];
  public newTasks: any = [];
  public showOverudeTaskFlag: boolean = false;
  public weekName = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  public today = new Date();
  public dateIndex = -4;




  groupEventFilter: EventGroupFilter = new EventGroupFilter();
  eventGroups: EventGroup[];
  schedule: DashboardSchedule;
  isLoading: boolean = false;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private eventGroupService: EventGroupService, private loadingCtrl: LoadingController) {
    let userInfo = JSON.parse(localStorage.getItem('currentUser'));
    if(userInfo.user_profile){
      this.userphoto = userInfo.user_profile.avatar;
    } else {
      this.userphoto = 'assets/slideimage/img.png';
    }
  	this.getWeekbar();
    this.gettingTasks();
  }

  ngOnInit() {
    this.makingSchedule();
    
  }

  gettingTasks(){
    this.overudeTasks = [{title: "Send Questionarire", content: "Sam's family Portrait"}, {title: "Schedule Consulation", content: "Sam's family Portrait"},
                        {title: "Another Task", content: "Sam's family Portrait"}];
    this.newTasks = [{title: "Send Questionarire", content: "Sam's family Portrait"}, {title: "Schedule Consulation", content: "Sam's family Portrait"},
                        {title: "Another Task", content: "Sam's family Portrait"}];
  }
 

  getWeekbar(){

    this.weeklist = [];
    // console.log("newdate", centerDate);
    for(var ii=0; ii< 7; ii++){
      let newDate = new Date();
      newDate.setDate(this.today.getDate() + this.dateIndex + ii);
      let weekitem = {name: this.weekName[newDate.getDay()], Day: newDate.getDate()};
      this.weeklist.push(weekitem);
    }
    
  	// this.weeklist = [{name: "S", Day: "15"}, {name: "M", Day: "16"}, {name: "T", Day: "17"},
  	// 	{name: "W", Day: "18"}, {name: "T", Day: "19"}, {name: "F", Day: "20"}, {name: "S", Day: "21"}];
  }

  onClickProfile(){
  	console.log("aaaaaa");
  }

  onClickoverudeTasks(){
    this.showOverudeTaskFlag = !this.showOverudeTaskFlag;
  }

  onClickSerch(){

  }

  onClickSetting() {
    let settingModal = this.modalCtrl.create(FeedSettingModal);
    settingModal.present();

  }

  onClickModal(index){
    let modal1;
    switch (index) {
      case 0:
        modal1 = this.modalCtrl.create(TaskMarkModal);
        
        break;
      case 2:
        modal1 = this.modalCtrl.create(CalendarModalPage);
        // modal1.present();
        break;
      
      default:
        // code...
        break;
    }
    modal1.present();
  }

  swiped(event){
    if(event.direction == 2){
      this.swipeLeft();
    } else if(event.direction == 4){
      this.swipeRight();
    }   

  }

  makingSchedule(){
    let startDate = new Date();
    startDate.setDate(this.today.getDate() + this.dateIndex);
    startDate.setHours(0);

    let endDate = new Date();
    endDate.setDate(this.today.getDate() + this.dateIndex + 6);
    endDate.setHours(23);
    this.updateEventGroupFilter({
      from_date: moment(startDate),
      to_date: moment(endDate)
    });

  }

  swipeLeft(){
    this.dateIndex ++; 
    this.getWeekbar();
    this.makingSchedule();
  }

  swipeRight(){
    this.dateIndex --; 
    this.getWeekbar();
    this.makingSchedule();
  }



  private updateEventGroupFilter(changes: EventGroupFilterParams) {
    this.groupEventFilter.updateFilterParams(changes);
    this.loadGroupEvents();
  }

  private loadGroupEvents() {
    this.isLoading = false;
    let loading = this.loadingCtrl.create();
    loading.present();
    let params = this.groupEventFilter.toQueryParams();
    this.eventGroupService.getList(params).subscribe(
      this.extractEvents.bind(this),
      () => {},
      () => { this.isLoading = true; loading.dismiss();}
    );
  }

  private extractEvents(res) {
    this.eventGroups = res.results;

    console.log("eventgroups", this.eventGroups);
    this.generateSchedule();
  }

  private generateSchedule() {
    // console.log("startdate", this.groupEventFilter.params.from_date);
    // console.log("endDate", this.groupEventFilter.params.to_date);
    this.schedule = new DashboardSchedule(
      this.eventGroups,
      this.groupEventFilter.params.from_date,
      this.groupEventFilter.params.to_date);
    console.log("schedule", this.schedule);
    // this.fillWeatherIcons();
  }

  private fillWeatherIcons() {
    this.schedule.days.forEach((day) => {
      day.events.forEach((scheduleEvent) => {
        if (scheduleEvent.needFetchWeather) {
          scheduleEvent.fillWeatherIcon(this.eventGroupService);
        }
      });
    });
  }
  
}
