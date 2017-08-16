import { NgModule }                          from '@angular/core';
import { IonicApp, IonicModule, Slides} from 'ionic-angular';
/* Components */
import { LoginPage }                    from './login/login';
// import { SignUpComponent }                   from './sign-up/sign-up.component';
// import { ForgotPasswordComponent }           from './forgot-password/forgot-password.component';
// import { ChangePasswordComponent }           from './change-password/change-password.component';
/* Modules */
import { BrowserModule } from '@angular/platform-browser';


import { GeneralFunctionsService } from "../../services/general-functions";
import { AccessService } from "../../services/access";




@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
  BrowserModule,
  IonicModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginPage,
  ],
  providers: [
    GeneralFunctionsService,
    AccessService
  ]
})
export class AccessModule {}
