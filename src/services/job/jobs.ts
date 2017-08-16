import { Injectable } from '@angular/core';
import { Job } from '../../models/job';

@Injectable()
export class JobList {

  public jobs:Array<Job> = [];
  public recentlyJobs: Job[] = [];
  public newjobId: number;
  public selectedjob: Job;

  public detailedJob : Job;

  public jobTypes : Array<any> = [];
  constructor(){
  	this.managingRecentJobs();
  }

  setJobs(arrayjobs){
    this.jobs = arrayjobs;
  }

  getJobs(): Array<Job> {
    return this.jobs;
  }

  putSelectedJob(newjob: Job){
    this.selectedjob = newjob;
    this.putRecentJob(newjob);
  }

  getSelectedJob(){
    return this.selectedjob;
  }

  setDetailedJob(job: Job){
    this.detailedJob = job;
  }

  getDetailedJob(){
    return this.detailedJob;
  }

  putRecentJob(newjob: Job){
  	this.newjobId = newjob.id;

  	let existId = this.recentlyJobs.findIndex(this.existingIdFilter, this);
  	newjob.recentDate = new Date().toISOString();
  	if(existId >-1){
  		this.recentlyJobs.splice(existId, 1);
  	} else if(this.recentlyJobs.length >= 10){
  		this.recentlyJobs.pop();
  	} 
  	this.pushStack(newjob);
  	
  }

  pushStack(newjob: Job){
    let stackJobs: Job[] = [];
    for(let ii=0; ii<this.recentlyJobs.length; ii++){
      stackJobs[ii+1] = this.recentlyJobs[ii];
    }

    stackJobs[0] = newjob;
    this.recentlyJobs = stackJobs;
    sessionStorage.setItem("recentJobs", JSON.stringify(this.recentlyJobs));
  }

  getRecentJobs(): Array<Job> {
  	return this.recentlyJobs;
  }

  managingRecentJobs(){
  	let oldJobs = JSON.parse(sessionStorage.getItem("recentJobs"));
    if(oldJobs){
      this.recentlyJobs = oldJobs.filter(this.datefilter);
      sessionStorage.setItem("recentJobs", JSON.stringify(this.recentlyJobs));
    }
  	
  }

  existingIdFilter(newJob: Job){
  	return newJob.id == this.newjobId;
  }

  datefilter(jobitem: Job){
  	let newDate = new Date();
  	let oldDate = new Date(jobitem.recentDate);
  	return newDate.getTime() - oldDate.getTime() < 864000000;
  }

  //  setJobType(jobtypes){
  //   this.jobTypes = jobtypes;
  // }

  // getJobType(){
  //   return this.jobTypes;
  // }


 
}
