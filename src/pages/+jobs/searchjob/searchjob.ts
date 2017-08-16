import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
import { JobDetailPage } from '../job-detail-controller/job-detail-controller';
import { Job }                     from '../../../models/job';
import { JobList }              from '../../../services/job/jobs';
@Component({
  selector: 'page-searchjob',
  templateUrl: 'searchjob.html'
})
export class SearchjobPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  public items:any = [{icon: 'star', note:'aaa'}, {icon: 'star', note:'aaa'}, {icon: 'star', note:'aaa'}, {icon: 'star', note:'aaa'}];
  public searchData: string = '';
  public searchedJobs: Job[] = [];
  public jobs:Job[] = [];
  public recentJobs: Job[] = [];
  constructor(public navCtrl: NavController, public popCtrl: PopoverController, public jobListService: JobList) {

    this.jobs = this.jobListService.getJobs();
    this.getrecentJobs();
  }

  ionViewDidEnter(){
    this.getrecentJobs();
  }

  getrecentJobs(){
    this.recentJobs = this.jobListService.getRecentJobs();
  }


  searchFilter(jobitem: Job){

    return jobitem.name.indexOf(this.searchData) > -1 ;
  }

  onInput(ev){
    if(this.searchData && this.jobs){
      this.searchedJobs = this.jobs.filter(this.searchFilter, this);
    }
    
  }

  cancelSearch(){
    if(this.searchData){
      this.searchData = '';
    } else {
      this.navCtrl.pop();
    }
  }

  gotoJobDetail(event){
    console.log('aaaaa', event);
    // this.jobListService.putSelectedJob(selectedJob);
    this.navCtrl.push(JobDetailPage);
  }
 
  
}
