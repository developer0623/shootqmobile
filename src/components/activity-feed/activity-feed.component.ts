import { Component, Input, ViewContainerRef  } from '@angular/core';

import { ActivityService } from '../../services/activity/activity.service';


@Component({
  selector: 'activity-feed',
  templateUrl: 'activity-feed.component.html'
})
export class ActivityFeedComponent {
  @Input() type: string = 'account';
  @Input() target: number;
  @Input() contentType: number;
  @Input() showTargetMeta: boolean = true;

  isLoading: boolean = false;
  feed: any[] = [];

  constructor(
    private vcRef: ViewContainerRef,
    private activityService: ActivityService
    ) {
  }

  public ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    let args = [];
    if (this.contentType && this.target)
      args = [this.contentType, this.target];

    this.isLoading = true;
    this.activityService[this.type](...args)
      .subscribe(
        (results) => {
          this.feed = results.items;
          this.isLoading = false;
        },
        (errors) => {
          console.error(errors);
        },
        () => { this.isLoading = false; }
      );
  }

  seeAll() {
    // let config = overlayConfigFactory({
    //   activities: this.feed,
    //   showTargetMeta: this.showTargetMeta
    // }, ActivitiesModalWindowData);
    // config.viewContainer = this.vcRef;
    // this.modal
    //   .open(ActivitiesModalComponent, config)
    //   .then(dialogRef => {
    //     dialogRef.result
    //       .then(result => {})
    //       .catch(() => {});
    //   });
  }


}
