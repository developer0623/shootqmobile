import { Component, Input, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import { SearchjobPage } from '../searchjob/searchjob';
import { JobDetailPage } from '../job-detail-controller/job-detail-controller';
import { JobService }              from '../../../services/job';
import { JobRoleService }              from '../../../services/job-role';
import { JobTypeService }              from '../../../services/job-type';
import { JobList }              from '../../../services/job/jobs';
import { archivedJobStatus, deletedJobStatus, Job }                     from '../../../models/job';
import { EventType }               from '../../../models/event-type';
import { JobSettingModal } from '../job-settings/job-settings';
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobList.html'
})
export class JobsPage implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page


  public jobs:                       Job[] = [];

  public userphoto: string ='';

  public orderBy:                    string = 'name';
  public orderDirection:             string;
  public currentFilter:              string = '';
  
  public totalItems:                 number = 0;
  public currentPage:                number = 1;
  public perPage:                    number = 0;
  public isArchived: boolean = false;

  public jobTypes: EventType[] = [];
  private roles:                     Array<any> = [];

  public jobColors: any = [{color: '#0000FF'},{color: '#3FDDE0'}, {color: '#02AD94'}, {color: '#E94C7E'}, {color: '#B600FF'}];
  public jobCustomType : any = [{title: 'N', content: 'None'}];
  tabbarElement: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
               private jobService: JobService,
               public jobList: JobList,
               public jobTypeService: JobTypeService,
               public jobRoleService: JobRoleService,
               private modalCtrl: ModalController
               ) {
    // let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let userInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.userphoto = userInfo.user_profile.avatar;
    this.tabbarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter(){
    this.tabbarElement.style.display = 'flex';
  }

  ngOnInit() {
      this.jobTypes = this.jobTypeService.getJobType();
      // console.log("jobtypes", this.jobTypes);
      if(this.jobTypes.length == 0){
        this.gettingJobType();
      } else {
         this.loadJobs();
      }
    }

  // ionViewWillLeave(){
  //   this.tabbarElement.style.display = 'none';
  // }

  gettingJobType(){
    this.jobTypeService.getList()
      .subscribe(types => {
        this.jobTypes = types.results;
        this.jobTypeService.setJobType(this.jobTypes);
        console.log("jobtypes", this.jobTypes);
        this.loadJobs();

        // console.log("jobTypes", this.jobTypes);
    });

    this.jobRoleService.getList()
      .subscribe(data => {
        this.roles = [{
          id: 0,
          name: '-'
        }];
        for (let role of data.results) {
          this.roles.push(role);
        }

        console.log("roles", this.roles);
      });
  }

  // makingCustomJobType(){
    // this.jobCustomType = [{title: 'N', content: 'None'}];
    // this.jobTypes.forEach(function(jobtype, index){
    //   let newjobtype = {title:'', content:''};
    //   let jobtitlearray = jobtype.name.split(' ');
    //   for(var ii=0; ii<jobtitlearray.length;ii++){
    //     newjobtype.title +=jobtitlearray[ii][0];
    //   }
    //   newjobtype.content = jobtype.name;

    //   this.jobCustomType.push(newjobtype);
    // }, this);

    // this.jobTypeService.setJobCustomType(this.jobCustomType);
  // }

  gotoJobDetail(event, jobid){
    console.log("eventemitter", event);
    this.tabbarElement.style.display = 'none';    
    this.navCtrl.push(JobDetailPage, {jobid: jobid});
  }

  gotoSearchJob(){
    this.navCtrl.push(SearchjobPage);
  }

  onClickProfile(){
  	console.log("aaaaaa");
  }


  onClickSetting() {
    let settingModal = this.modalCtrl.create(JobSettingModal);
    settingModal.present();
  }


  loadJobs() {
    let filter = this.getJobFilter();

    let loading = this.loadingCtrl.create({spinner: 'bubbles'});
    loading.present();
    this.jobService
      .getList(filter)
      .subscribe(
        ({jobs, total}: {jobs: Job[], total: number}) => {
          console.log("jobs", jobs);
          loading.dismiss();
          jobs.forEach(function(job, index){
            if(!job.job_type){
               job.job_type = 0;
            }
          });
          this.jobs = jobs;
          this.jobList.setJobs(jobs);
          this.totalItems = total;
          // this.checkedJobIds = [];
          // this.hasPages = (this.perPage !== 0 && this.totalItems > this.perPage);
        },
        (err) => {
          console.error(err);
          loading.dismiss();
        },
        () => {
          
        }
      );
  }

  private orderByDirection = {
    'name': 'asc',
    'job_type__name': 'asc',
    'internal_owner__user_profile__user__first_name': 'asc',
    'external_owner__first_name': 'asc',
    'main_event_date': 'asc',
    'next_event_date': 'asc'
  };


  getJobFilter() {
    let ordering = `${this.orderByDirection[this.orderBy] === 'desc' ? '-' : ''}${this.orderBy}`,
      filter;

    filter = {
      ordering: ordering,
      filter: this.currentFilter,
      page: this.currentPage,
      page_size: this.perPage
    };
    if (this.isArchived)
      filter['status'] = archivedJobStatus;
    else
      filter['status!'] = archivedJobStatus;

    return filter;
  }
  
}
