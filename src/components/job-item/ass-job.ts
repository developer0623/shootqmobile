import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
// import { NavController, ViewController, ModalController} from 'ionic-angular';

import { JobTypeService }              from '../../services/job-type'; 
import { JobList }              from '../../services/job/jobs';
@Component({
  selector: 'ass-job-item',
  templateUrl: 'ass-job.html'
})
export class AssJobItem implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @Input() job: any;
  public JobType: any;
  public jobItem: any = {};
  public isLoading: boolean = false;
  constructor(private jobTypeService: JobTypeService, private jobList: JobList){
  }

  ngOnInit() {

  	this.JobType = this.jobTypeService.getJobType();
  	 if(this.JobType.length == 0){
        this.gettingJobType();
     } else {
     	this.makingCustomItem();

     }
  	
  }
  gettingJobType(){
    this.jobTypeService.getList()
      .subscribe(types => {
        this.JobType = types.results;
        this.jobTypeService.setJobType(this.JobType);
        this.makingCustomItem();

        // console.log("jobTypes", this.jobTypes);
    });
  }

  	makingCustomItem(){
	  	this.jobItem = this.job;

	  	let newjobtype = {title:'', content:'', color: ''};
	  	if(this.jobItem.job_type){

		  	let selectedTypes = this.JobType.filter(function(item){
		  			if(item.id == this.jobItem.job_type){
		  				return item;
		  			}
		  		}, this);
	  	
	  	
	  		let jobtitlearray = selectedTypes[0].name.split(' ');
	      	for(var ii=0; ii<jobtitlearray.length;ii++){
	        	newjobtype.title +=jobtitlearray[ii][0];
	      	}
	      	newjobtype.content = selectedTypes[0].name;
	      	newjobtype.color = selectedTypes[0].color;
	  	} else {
	  		newjobtype = {title: 'N', content: 'None', color: '#0000FF'};	      
	  	}
	  	this.jobItem.custom_type = newjobtype;
	  	this.isLoading = true;
 	}  
  
}
