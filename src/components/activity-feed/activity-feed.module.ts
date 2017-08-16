import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import 'intl';
import 'intl/locale-data/jsonp/en';
import {  ActivityFeedComponent } from './activity-feed.component';
import {  ActivityItemComponent } from './activity-item/activity-item.component';
import { ActivityService } from '../../services/activity/activity.service';
import { ContractService } from '../../services/contract';
import { TemplateVariableService } from '../../services/template-variable/template-variable.service';

@NgModule({
    declarations: [
        ActivityFeedComponent,
        ActivityItemComponent
    ],
    imports: [IonicModule],
    exports: [ActivityFeedComponent],
    entryComponents: [ActivityFeedComponent, ActivityItemComponent],
    providers: [ ActivityService, ContractService, TemplateVariableService ]
})
export class NgActivityFeeedModule {
}
