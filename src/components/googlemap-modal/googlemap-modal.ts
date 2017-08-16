import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams, LoadingController} from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderForwardResult} from '@ionic-native/native-geocoder';


declare var google;

@Component({
  selector: 'page-googlemap-modal',
  templateUrl: 'googlemap-modal.html'
})
export class GooglemapModalPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  private address: any;
  public location: any = {lat:'', lon: ''};
  constructor(private nativeGeocoder: NativeGeocoder, private navParams: NavParams,
   private viewCtrl: ViewController, private loadingCtrl: LoadingController){
    this.address = this.navParams.get('address');
    this.getLocation();

  }

  getLocation(){
    let loading = this.loadingCtrl.create();
    loading.present();
    this.nativeGeocoder.forwardGeocode(this.address)
    .then((coordinates:NativeGeocoderForwardResult) => {
      loading.dismiss();
      this.location.lat = coordinates.latitude;
      this.location.lon = coordinates.longitude;
      this.loadMap();
    })
    .catch((error:any)=> {
      loading.dismiss();
      this.viewCtrl.dismiss();
      console.log(error);
    });
  }


  loadMap(){
    let latLng = new google.maps.LatLng(this.location.lat, this.location.lon);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    marker.setMap(this.map);
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  ngOnInit(){

  }
  
}
