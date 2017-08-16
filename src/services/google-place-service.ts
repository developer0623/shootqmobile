import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http, RequestOptions, Headers } from '@angular/http';
import {Injectable, OnInit} from "@angular/core";
import 'rxjs/add/operator/map';

declare var google: any;

@Injectable()
export class GooglePlaceService implements AutoCompleteService, OnInit{
  labelAttribute = "description";
  // labelAttribute = "name";
  autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;
  constructor(public http: Http) {
    
    
  }

  ngOnInit() {
                
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };        
    }
  
  
  getResults(keyword:string){
    this.acService = new google.maps.places.AutocompleteService();
    
        let self = this;
        let config = { 
            types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: keyword, 
            componentRestrictions: { country: 'AR' } 
        }
        return this.acService.getPlacePredictions(config, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];            
            predictions.forEach(function (prediction) {              
                self.autocompleteItems.push(prediction);
            });
            console.log("result", self.autocompleteItems);
            return Promise.resolve(self.autocompleteItems);
            
        });


      // return this.http.get("https://restcountries.eu/rest/v1/name/"+keyword)
      // .map(
      //   result =>
      //   {
      //     console.log("result", result.json());
      //     return result.json()
      //       .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()) )
      //   });
  }
}
