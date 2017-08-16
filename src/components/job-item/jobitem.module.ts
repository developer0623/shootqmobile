import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { JobItem } from './job-item';
import { AssJobItem } from "./ass-job";

@NgModule({
    declarations: [
        JobItem,
        AssJobItem
    ],
    imports: [IonicModule],
    exports: [JobItem, AssJobItem],
    entryComponents: [JobItem, AssJobItem]
})
export class NgJobItemModule {
}
