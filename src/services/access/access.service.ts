import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Storage } from "@ionic/storage";


import * as _ from 'lodash';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { CurrentUser } from '../../models/user';

import { ApiService } from '../api';
import { GeneralFunctionsService } from '../general-functions';
import { ConstData } from "../const";
declare let require: (any);
declare let process: (any);

export const CURRENT_PROFILE_ID = 1;

export interface OAuthInfo {
  scope: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  is_client_token?: boolean;
}

@Injectable()
export class AccessService {


  /**
   * This event is emitted right after the user has been successfully
   * authenticated by the API server.
   *
   * Note that the user profile is not available yet.
   * If you need to make sure that the profile of the currently authenticated
   * user is available then subscribe to `currentUser$` instead.
   */
  public userLoggedIn = new Subject<void>();

  /**
   * This event is emitted right after the user is logged out.
   * At this point the `currentUser` has been reset to `null`.
   * All the following calls to the API would be not authenticated.
   */
  public userLoggedOut = new Subject<void>();

  /**
   * Emits the currently authenticated user or `null` if the user profile
   * isn't available.
   *
   * @example Detect the changes in the current user profile, ignoring
   * anonymous user
   *
   * this.accessService.currentUser$
   *   .filter(_.identity)
   *   .subscribe(value => this.currentUser = value);
   */
  public currentUser$: Observable<CurrentUser>;

  private currentUserSubject = new BehaviorSubject<CurrentUser>(null);
  private canAccess: boolean = false;
  private functions;

  /* User Profile endpoint */
  private userProfileEndpoint = '/auth/me/';
  private oAuthLoginEndpoint = '/o/token/';

  /* Client Share endpoint */
  private clientShareEndpoint = '/account/clientshare/';

  /* Account endpoint */
  private accountEndpoint = '/account/account/';
  private accountWorkerListEndpoint = '/account/account/:account/worker_list/';
  private accountInvitationListEndpoint = '/account/account/:account/invitation_list/';

  /* User Sign Up endpoint */
  private signUpEndpoint = '/account/signup/';
  private testUniqueUsernameEndpoint = '/account/signup/test_unique_username/';
  private testUniqueEmailEndpoint = '/account/signup/test_unique_email/';

  /* User Password Reset endpoint */
  private PasswordResetRequestResetEndpoint = '/account/passwordreset/request_reset/';
  private PasswordResetPerformResetEndpoint = '/account/passwordreset/:key/perform_reset/';
  private KeyCheck = '/account/key/:key/expiration/';
  // Initialize services
  constructor(private http: Http,
              private apiService: ApiService, private storage: Storage, private constData:ConstData
              ) {
    this.functions = new GeneralFunctionsService();
    this.currentUser$ = this.currentUserSubject.asObservable();
    // Fetch the current user profile from the API server as early as possible
    // and emit the retrieved value to `currentUser$` subscribers.
    setTimeout(() => this.getUserProfileInfo().subscribe());
    setTimeout(() => this.getLoggedAccountId().subscribe());
  }

  /**
   * Information about the currently authenticated user profile.
   *
   * @return {CurrentUser} object if the user is authenticated and
   * the profile is fetched from the API server, otherwise it returns `null`.
   */
  get currentUser(): CurrentUser {
    return this.currentUserSubject.value;
  }

  /**
   * Function to check if the current component can be accessed or
   * require additional permissions.
   */
  // public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   // Get token and set for all requests.
  //   this.canAccess = this.getCanAccess();
  //   if (!this.canAccess) {
  //     // Save, state.url as referer
  //     if (state.url !== undefined
  //       && state.url !== null
  //       && state.url !== '/login'
  //       && state.url !== '/sign-up'
  //       && state.url !== '/forgot-password'
  //     ) {
  //       sessionStorage.setItem('refererUrl', state.url);
  //     }
  //     this.router.navigate(['/login']);
  //   }
  //   return this.canAccess;
  // }

  /**
   * Get the user profile information.
   */
  public getUserProfileInfo() {
    return this.apiService.get(this.userProfileEndpoint)
      .catch(error => {
        this.currentUserSubject.next(null);
        return Observable.throw(error);
      })
      .map(value => Object.assign(new CurrentUser(), value))
      .do(value => {
        localStorage.setItem('currentUser', JSON.stringify(value));
        this.currentUserSubject.next(value);
      });
  }

  /**
   * Change the user profile information.
   */
  public updateUserProfileInfo(data) {
    return this.apiService.put(this.userProfileEndpoint, data)
      .map(value => Object.assign(new CurrentUser(), value))
      .do(value => this.currentUserSubject.next(value));
  }

  /**
   * doOAuthLogin function to authenticate through API server.
   */
  public doOAuthLogin(loginData: any) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.apiService.oAuthPost(this.oAuthLoginEndpoint, loginData, headers);
  }

  /**
   * Verifies the provided user credentials and logs the user in if succeed.
   * @param username
   * @param password
   * @return {Observable<CurrentUser>} The profile of the authenticated user.
   */
  login(logindata) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    // let form: URLSearchParams = new URLSearchParams();
    // form.set('username', username);
    // form.set('password', password);
    // form.set('grant_type', this.constData.grant_type);
    // form.set('client_id', this.constData.clinet_id);
    // form.set('client_secret', this.constData.client_secret);


    return this.apiService.oAuthPost(this.oAuthLoginEndpoint, logindata, headers)
      // setup the auth session, emit the `userLoggedIn` event
      .do((response) => {
        localStorage.setItem('OAuthInfo', JSON.stringify(response));
        this.setCredentials();
        this.userLoggedIn.next();
        this.userLoggedIn.complete();
      })
      // fetch the current user profile and the account information
      .flatMap(() => this.getLoggedAccountId())
      .flatMap(() => this.getUserProfileInfo());
  }

  logout() {
    localStorage.removeItem('OAuthInfo');
    localStorage.removeItem('ImpersonateOAuthInfo');
    localStorage.removeItem('accountInfo');
    sessionStorage.removeItem('refererUrl');
    localStorage.removeItem('currentUser');
    // Make sure that the API requests cannot be performed on behalf of
    // the user being logged out.
    this.apiService.headers = new Headers();
    // Reset the current user data with null and notify the subscribers
    this.currentUserSubject.next(null);
    this.userLoggedOut.next();
  }

  /**
   * Function to get logged in account id.
   */
  public getLoggedAccountId() {
    return this.apiService.get(`${this.accountEndpoint}`).do(
      (data) => {
        localStorage.setItem('accountInfo', JSON.stringify(data));
        this.apiService.setHeaders();
      });
  }

  public updateLoggedAccountInfo(id, data) {
    return this.apiService.put(`${this.accountEndpoint}${id}/`, data);
  }

  /**
   * Function to get workers related to the actual account.
   */
  public getAccountWorkerList() {
    let account = _.first(JSON.parse(localStorage.getItem('accountInfo')));
    return this.apiService.get(`${this.accountWorkerListEndpoint.replace(':account', account['id'])}`)
      .do(() => this.apiService.setHeaders());
  }

  /**
   * Function to get workers related to the actual account.
   */
  public getAccountInvitationList() {
    let account = _.first(JSON.parse(localStorage.getItem('accountInfo')));
    return this.apiService.get(`${this.accountInvitationListEndpoint.replace(':account', account['id'])}`)
      .do(() => this.apiService.setHeaders());
  }

  /**
   * Call to set the API call header
   */
  public setCredentials(id?: number) {
    if (id !== undefined) {
      this.apiService.setHeaders(id);
    } else {
      this.apiService.setHeaders();
    }
  }

  /**
   * [doResetPassword description]
   * @param {string} email [description]
   */
  public doResetPassword(email: string) {
    return this.apiService.post(this.PasswordResetRequestResetEndpoint,
      {'email': email}, {'Content-Type': 'application/json'});
  }

  /**
   * [doChangePassword description]
   * @param {string} key [description]
   * @param {string} password [description]
   */
  public doChangePassword(key: string, password: string) {
    return this.apiService.post(this.PasswordResetPerformResetEndpoint.replace(':key', key),
      {'password': password}, {'Content-Type': 'application/json'});
  }

  public doKeyCheck(key: string) {
    return this.apiService.get(this.KeyCheck.replace(':key', key),
      {'Content-Type': 'application/json'});
  }

  public updatePassword(data) {
    return this.apiService.put('/account/change-password/', data);
  }

  /**
   * [doOAuthSignUp description]
   * @param {any} signUpData [description]
   */
  public doOAuthSignUp(signUpData: any) {
    return this.apiService.post(this.signUpEndpoint, signUpData,
      {'Content-Type': 'application/json'});
  }

  /**
   * [testUniqueUsername description]
   * @param {string} username [description]
   */
  public testUniqueUsername(username: string) {
    return this.apiService.post(this.testUniqueUsernameEndpoint,
      {'username': username}, {'Content-Type': 'application/json'});
  }

  /**
   * [testUniqueEmailEndpoint description]
   * @param {string} email [description]
   */
  public testUniqueEmail(email: string) {
    return this.apiService.post(this.testUniqueEmailEndpoint,
      {'email': email}, {'Content-Type': 'application/json'});
  }

  // isClientArea(state: RouterStateSnapshot): boolean {
  //   let clientPaths = ['/public/client-access', '/booking'];
  //   return _.some(clientPaths.map(p => state.url.startsWith(p)));
  // }

  getoAuthInfo(): OAuthInfo | null {
    let oAuthRawInfo = localStorage.getItem('OAuthInfo');
    // if (this.router.url.indexOf('/public/client-access') === 0) {
    //   oAuthRawInfo = localStorage.getItem('ImpersonateOAuthInfo');
    // }
    return JSON.parse(oAuthRawInfo);
  }

  isClientToken(): boolean {
    let oAuthInfo = this.getoAuthInfo();
    return !!oAuthInfo && oAuthInfo.is_client_token;
  }

  public getClientShareContact() {
    let path = `${this.clientShareEndpoint}`;
    return this.apiService.get(path);
  }
}
