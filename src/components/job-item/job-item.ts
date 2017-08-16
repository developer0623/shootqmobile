import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
// import { NavController, ViewController, ModalController} from 'ionic-angular';

import { JobTypeService }              from '../../services/job-type'; 
import { JobList }              from '../../services/job/jobs';
@Component({
  selector: 'job-item',
  templateUrl: 'job-item.html'
})
export class JobItem implements OnInit {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  @Input() job: any;
  @Input() itemType: boolean;
  @Output() onClickItem = new EventEmitter();
  public JobType: any;
  public jobItem: any = {};
  constructor(private jobTypeService: JobTypeService, private jobList: JobList){
  }

  ngOnInit() {
  	this.JobType = this.jobTypeService.getJobType();
  	this.makingCustomItem();
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
 	}

 	onClick(){
 		this.jobList.putSelectedJob(this.jobItem);
 		this.onClickItem.emit(true);
 	}
  
  
}
