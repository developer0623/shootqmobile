import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { RestClientService } from '../rest-client/rest-client.service';
import { EventType } from '../../models/event-type';

@Injectable()
export class EventTypeService extends RestClientService<EventType> {
  baseUrl = 'event/eventtype';

  public static newObject(data?: object): EventType {
    return Object.assign(new EventType(), data || {});
  }

  public getList(queryParams = {}) {
    _.defaults(queryParams, {active: true});
    return super.getList(queryParams);
  }
}
