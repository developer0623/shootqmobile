import { Injectable } from '@angular/core';
import { RestClientService } from '../rest-client/rest-client.service';
import { JobType } from '../../models/job-type';

@Injectable()
export class JobTypeService extends RestClientService<JobType> {
  baseUrl = 'job/jobtype';

  public jobColors: any = [{color: '#0000FF'},{color: '#3FDDE0'}, {color: '#02AD94'}, {color: '#E94C7E'}, {color: '#B600FF'}];
  public jobType : Array<any> = [];


  getJobColors(){
  	return this.jobColors;
  }
  setJobType(jobtypes){
  	this.jobType = jobtypes;
  }

  getJobType(){
  	return this.jobType;
  }


}
