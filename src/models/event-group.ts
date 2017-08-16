import moment from 'moment';
import { FormGroup } from '@angular/forms';
import { Event } from './event';
import { BaseLocation } from './address';

export interface EventGroupTimeSlot {
  start: string;
  end: string;
}

export class EventGroup {
  account?: number;
  brand?: number;
  contact?: number;
  created?: string;
  events?: Array<Event>;
  id?: number;
  job?: number;
  modified?: string;
  name: string;
  location_name?: string;
  address?: string;
  start?: string;
  end?: string;
  all_day?: boolean;
  location?: BaseLocation;
  event_type?: number;
  event_type_color?: string;
  event_type_name?: string;
  event_type_data?: any;
  guests?: Array<number>;
  description?: string;

  static setInitialStartTime(group: FormGroup) {
    group.controls['start'].valueChanges
      .first()
      .subscribe(changes => {
        let startValue = changes.clone().set({
          hour: 12,
          minute: 0,
          second: 0,
          millisecond: 0
        });
        group.patchValue({start: startValue});
      });
  }

  static setInitialEndTime(group: FormGroup) {
    let formValue = group.value;
    if (formValue && formValue['start'] && !formValue['end']) {
      group.patchValue({
        end: moment(formValue['start']).clone().add(30, 'minutes')
      });
    }
  }

  static isEnoughTimeForNewGroup(prevGroup: EventGroup | null, nextGroup: EventGroup | null): boolean {
    if (prevGroup && prevGroup.end && nextGroup && nextGroup.start) {
      let prevEnd = moment(prevGroup.end);
      let nextStart = moment(nextGroup.start);
      return nextStart.diff(prevEnd, 'minutes') > 1;
    }
    return true;
  }

  static getNewGroupTimeSlot(prevGroup: EventGroup | null, nextGroup: EventGroup | null): EventGroupTimeSlot {
    if (!prevGroup && !nextGroup) {
      let start = moment().add(1, 'day').set({hour: 12, minute: 0, second: 0, millisecond: 0});
      return {
        start: start.toISOString(),
        end: start.clone().add(30, 'minutes').toISOString()
      };
    }
    if (prevGroup && prevGroup.end && !nextGroup) {
      let start = moment(prevGroup.end);
      return {
        start: start.toISOString(),
        end: start.clone().add(30, 'minutes').toISOString()
      };
    }
    if (nextGroup && nextGroup.start && !prevGroup) {
      let start = moment(nextGroup.start).subtract(30, 'minutes');
      return {
        start: start.toISOString(),
        end: start.clone().add(30, 'minutes').toISOString()
      };
    }
    if (prevGroup && prevGroup.end && nextGroup && nextGroup.start) {
      let prevEnd = moment(prevGroup.end);
      let nextStart = moment(nextGroup.start);
      let diffInMinutes = nextStart.diff(prevEnd, 'minutes');
      let slotInMinutes = diffInMinutes > 30 ? 30 : diffInMinutes;
      return {
        start: prevEnd.toISOString(),
        end: prevEnd.clone().add(slotInMinutes, 'minutes').toISOString()
      };
    }
  }
}
