import { Component, Input, ViewContainerRef  } from '@angular/core';
import { LoadingController } from "ionic-angular";
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

  feedCount: number = 10;

  constructor(
    private vcRef: ViewContainerRef,
    private activityService: ActivityService,
    private loadingCtrl: LoadingController
    ) {
  }

  public ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    let loading = this.loadingCtrl.create();
    loading.present();
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
        () => { this.isLoading = false; loading.dismiss();}
      );
  }

  doInfinite(infiniteScroll){
    if(this.feedCount+10 < this.feed.length){
      this.feedCount+=10;
    } else {
      this.feedCount = this.feed.length;
    }
    setTimeout(function(){
      infiniteScroll.complete();
    }, 500);

    
  }

  


}
