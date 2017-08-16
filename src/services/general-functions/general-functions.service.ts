import moment from 'moment';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';
declare let require: (any);

@Injectable()
export class GeneralFunctionsService {
  

  private countries: Array<any> = require('country-data/data/countries.json');
  private uSStates: Array<any> = require('../../assets/states/us-states/us-states.json');
  private canadaStates: Array<any> = require('../../assets/states/canada-states/canada-states.json');

  // private generalColors = [
  //   'green',
  //   'orange',
  //   'yellow',
  //   'red',
  //   'black',
  // ];

  constructor() {
    
  }

  static parseUrl(value) {
    let match = value.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
      };
  }

  public getSortOrderParam(sort: any, cname?: string): string {
    let order: string = 'ordering=';
    let name: string = '';

    // Sort By Name
    name = ((cname === undefined || cname === '') ? 'first_name,last_name' : cname);

    if (!sort.nameAsc && (cname === undefined || cname === '')) {
      name = '-first_name,-last_name';
    } else if (!sort.nameAsc && cname !== undefined) {

      let splittedItems = cname.split(',');
      let itemsLength = splittedItems.length;

      for (let i = 0; i < itemsLength; i++) {

        if (i === 0 && splittedItems[i] !== undefined) {
          name = `-${splittedItems[i]}`;
        } else if (splittedItems[i] !== undefined) {
          name += `,-${splittedItems[i]}`;
        }
      }
    }

    // Sort by email
    let email = 'default_email__address';
    if (!sort.emailAsc) {
      email = '-default_email__address';
    }

    // Sort by creation date
    let date = 'created';
    if (!sort.dateCreatedAsc) {
      date = '-created';
    }

    if (sort.sortedBy === 'name') {
      order += name + ',' + date;
    } else if (sort.sortedBy === 'email') {
      order += email + ',' + date;
    } else {
      order += date + ',' + name;
    }
    return order;
  }


  public getSearchParams(params: Object = {}) {
    let res: URLSearchParams = new URLSearchParams();
    for (let key in params) {
      if (params.hasOwnProperty(key))
        res.set(key, params[key]);
    }
    return res;
  }


  public getStateNameByIsocode2(isocode: string): string {
    let canadaRes: any = this.getNameFromIsocode2(isocode, this.canadaStates);
    let usaRes: any = this.getNameFromIsocode2(isocode, this.uSStates);
    if (false === canadaRes) {
      return usaRes;
    } else {
      return canadaRes;
    }
  }

  /**
   * Function to get the country name of a given isocode2
   *
   * @param  {string} isocode [description]
   * @return {string}         [description]
   */
  public getCountryNameByIsocode2(isocode: string): string {
    return this.getNameFromIsocode2(isocode, this.countries);
  }


  /**
   * Generic function to return isocode2 from country or state.
   *
   * @param  {string}     isocode     [description]
   * @param  {Array<any>} arrToSearch [description]
   * @return {string}                 [description]
   */
  private getNameFromIsocode2(isocode: string, arrToSearch: Array<any>): any {
    for (let entity of arrToSearch) {
      if (isocode === entity.alpha2) {
        return entity.name;
      }
    }
    return false;
  }

   public sanitizeDate(date: string) {
    if (date) {
      let dt = <moment.Moment>moment(date);
      if (!dt.isValid()) {
        return null;
      }
      let aux = dt.format();
      let p = aux.indexOf('+');
      if (p >= 0) {
        aux = aux.substr(0, p);
      }
      return aux;
    } else {
      return date;
    }
  }

  public formatFileSize(bytes) {
     if (bytes === 0) return '0 Byte';

     let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
       i = Math.floor(Math.log(bytes) / Math.log(1024));
     return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  public isString(value: any) {
    return typeof value === 'string';
  }

  public isUndefined(value: any) {
    return typeof value === 'undefined';
  }

  public extractDeepPropertyByMapKey(obj: any, map: string): any {
    const keys = map.split('.');
    const key = keys.shift();

    return keys.reduce((prop: any, k: string) => {
      return !this.isUndefined(prop) && !this.isUndefined(prop[k])
        ? prop[k]
        : undefined;
    }, obj[key || '']);
  }


  /**
   * Function to remove html tags from given text.given
   *
   * @param {[type]} text [description]
   */
  public removeHtmlTags(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '').replace('&nbsp;', '') : '';
  }

}
