import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ConstData } from "../../../services/const";
import { GeneralFunctionsService } from "../../../services/general-functions";
import { AccessService } from "../../../services/access";
import { SlidePage} from "../../slide/slide";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[GeneralFunctionsService]
})
export class LoginPage {

	public user: any = {username:'', password: ''};
  public isLoading: boolean = false;

  constructor(public navCtrl: NavController,
  		private constdata: ConstData,
  		private generalFunctions:      GeneralFunctionsService,
      private accessService:         AccessService,
      private events: Events
  		) {
  }

  login(){

    let loginData = {
        'username': this.user.username,
        'password': this.user.password,
        'grant_type': this.constdata.grant_type,
        'client_id': this.constdata.clinet_id,
        'client_secret': this.constdata.client_secret,
      };
    let postData = this.generalFunctions.getSearchParams(loginData);

    if (this.user.username !== undefined
      && this.user.username !== ''
      && this.user.password !== undefined
      && this.user.password !== '') {
      // this.isLoading = true;
      this.accessService.login(postData.toString())
        .finally(() => this.isLoading = false)
        .subscribe((response) => {
            this.events.publish('user:login');
            this.navCtrl.push(SlidePage);
            
          },
          err => {
            console.error(err);
            // this.flash.error('Login failed. Please try again.');
            this.user.password = '';
          });
    } else {
      // this.flash.error('We didn\'t recognize the username or password you entered. Please try again.');
      this.isLoading = false;
      this.user.password = '';
    }

  	// let loginData = {
   //      'username': this.user.username,
   //      'password': this.user.password,
   //      'grant_type': this.constdata.grant_type,
   //      'client_id': this.constdata.clinet_id,
   //      'client_secret': this.constdata.client_secret,
   //    };
   //  let postData = this.generalFunctions.getSearchParams(loginData);
  	// if(this.user.username !='' && this.user.password!=''){
  	// 	this.accessService.doOAuthLogin(postData.toString())
   //      .subscribe(
   //        response => {
   //          console.log('auth info', response);
   //          sessionStorage.setItem('OAuthInfo', JSON.stringify(response));
   //          this.accessService.saveOauthInfo(response);
   //          this.accessService.setCredentials();
   //          this.getUserInfo();

   //          this.accessService.getLoggedAccountId()
   //            .subscribe(data => {
   //              sessionStorage.setItem('accountInfo', JSON.stringify(data));
   //              this.accessService.setCredentials();
   //              },
   //              err => {
   //                console.error(err);
                  
   //              },
   //              () => {
                  
   //              }
   //           );
            
   //          this.navCtrl.push(SlidePage);
   //          },
   //        err => {
   //          console.error(err);
   //        },
   //        () => {
            
   //        }
   //    );
  	// }
  	
  }

  // getUserInfo(){
  //   this.accessService.getUserProfileInfo()
  //     .subscribe(
  //       response=> {
  //         sessionStorage.setItem('userInfo', JSON.stringify(response));
  //         this.events.publish('user:login');
  //       },
  //       error => console.error(error),
  //       () => {}
  //     );
  // }

  // gotoResetPass() {

  // }
  
}
