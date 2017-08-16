import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import {
  AbstractControl, FormControl, FormGroup, ValidationErrors, Validators,
} from '@angular/forms';
import { Observable, Subject, BehaviorSubject, AsyncSubject } from 'rxjs';


import {
  Contact, ContactType,
  DefaultAddressDetails, DefaultEmailDetails, DefaultPhoneDetails
} from '../../../models/contact';
import { ContactService } from '../../../services/contact/contact.service';

import { EmailTypeService } from '../../../services/email-type/email-type.service';
import { PhoneTypeService } from '../../../services/phone-type/phone-type.service';
import { EmailType } from '../../../models/email-type';
import { PhoneType } from '../../../models/phone-type';
import { BaseAddress } from '../../../models/address';
import { DatePickerValue } from '../../../models/mydatepicker-model';
import {
  ContactDate, DATE_TYPE_ANNIVERSARY, DATE_TYPE_BIRTHDAY, DateType
} from '../../../models/contact-date';
import { JobRole } from '../../../models/job-role';
import { JobRoleService } from '../../../services/job-role/job-role.service';
import { AccessService } from '../../../services/access/access.service';

interface PageCursor<T> {
  results: T[];
  count: number;
}

export class ContactPageCursor implements PageCursor<Contact> {
  results: Contact[];
  count: number;
}



function emailOrEmpty(control: AbstractControl): ValidationErrors | null {
  if (!control || !control.value)
    return null;
  return Validators.email(control);
}

class ContactFormContext {
  private content: Contact;
  private contactTypes: ContactType[];
  private dateTypes: DateType[];
  private emailTypes: EmailType[];
  private phoneTypes: PhoneType[];

  private defaultContactType: ContactType;
  private defaultEmailType: EmailType;
  private defaultPhoneType: PhoneType;
  private anniversaryDateType: DateType;
  private birthdayDateType: DateType;
  private defaultAddress;
  private defaultEmail;
  private defaultPhone;
  private anniversary: ContactDate;
  private birthday: ContactDate;

  static createForContact(
      contactData$: Observable<object>,
      contactTypes$: Observable<ContactType[]>, dateTypes$: Observable<DateType[]>,
      emailTypes$: Observable<EmailType[]>, phoneTypes$: Observable<PhoneType[]>
      ): Observable<ContactFormContext> {
    return Observable.zip(
        contactData$,
        contactTypes$,  // Note: do not filter contact types as it might be empty
        dateTypes$.filter(res => !!res.length),
        emailTypes$.filter(res => !!res.length),
        phoneTypes$.filter(res => !!res.length)
      )
      .map(results => {
        let result = new ContactFormContext();
        result.contactTypes = results[1];
        result.dateTypes = results[2];
        result.emailTypes = results[3];
        result.phoneTypes = results[4];
        result.defaultContactType = _.head(result.contactTypes) || new ContactType();
        result.defaultEmailType = _.head(result.emailTypes) || new EmailType();
        result.defaultPhoneType = _.head(result.phoneTypes) || new PhoneType();
        result.anniversaryDateType = _.find(result.dateTypes, 'isAnniversary');
        result.birthdayDateType = _.find(result.dateTypes, 'isBirthday');
        result.resetFromContact(ContactService.newObject(results[0]));
        return result;
      });
  }

  resetFromContact(contact: Contact) {
    this.content = contact;
    this.defaultAddress = Object.assign(new DefaultAddressDetails(), contact.default_address_details || {});
    this.defaultEmail = Object.assign(new DefaultEmailDetails(), contact.default_email_details || {});
    this.defaultPhone = Object.assign(new DefaultPhoneDetails(), contact.default_phone_details || {});
    this.anniversary = _.find(contact.dates, item => {
        return item.date_type_details && item.date_type_details.slug === DATE_TYPE_ANNIVERSARY;
      }) || new ContactDate();
    this.birthday = _.find(contact.dates, item => {
        return item.date_type_details && item.date_type_details.slug === DATE_TYPE_BIRTHDAY;
      }) || new ContactDate();
  }

  applyToForm(form: FormGroup, extra?: object) {
    let value = Object.assign({
      firstName: this.content.first_name || '',
      lastName: this.content.last_name || '',
      email: this.defaultEmail.address || '',
      phone: this.defaultPhone.number || '',
      postalAddress: this.defaultAddress.address1 || '',
      anniversary: (this.anniversary ? this.anniversary.date : '') || '',
      birthday: (this.birthday ? this.birthday.date : '') || '',
      default_address: this.defaultAddress
    }, extra || {});
    form.setValue(value);
  }

  getFormSubmitValue(form: FormGroup): Contact {
    // make sure that existing array values are not truncated
    // remove duplicate values from the form data
    let shouldSubmitAddress = !!form.value.postalAddress;
    let newAddress = (form.value.postalAddress || '').trim().toLocaleLowerCase();
    let addresses: object[] = _(this.content.addresses)
      .reject(item => item.toString().toLocaleLowerCase() === newAddress)
      .value();
    if (shouldSubmitAddress) {
      addresses.push(Object.assign(form.value.default_address || {}, {
        'default': true,
        visible: true
      }));
    }

    let dates: object[] = [];
    if (!!form.value.anniversary && !!this.anniversaryDateType)
      dates.push({
        date_type: this.anniversaryDateType.id,
        date: form.value.anniversary,
        id: this.anniversary.id
      });
    if (!!form.value.birthday && !!this.birthdayDateType)
      dates.push({
        date_type: this.birthdayDateType.id,
        date: form.value.birthday,
        id: this.birthday.id
      });

    // Make non-default all the emails currently present in the contact,
    // and set the value entered in the form field as the default one.
    let shouldSubmitEmail = !!form.value.email && !!this.defaultEmailType;
    let newEmail = (form.value.email || '').trim().toLocaleLowerCase();
    let emails: object[] = _(this.content.emails)
      .reject(item => item.address.trim().toLocaleLowerCase() === newEmail)
      .map(item => {
        return {
          // reset the `default` flag only of the form value isn't empty
          'default': !shouldSubmitEmail && item['default'],
          address: item.address,
          email_type: item.email_type,
          id: item.id
        };
      }).value();
    if (shouldSubmitEmail)
      emails.push({
        'default': true,
        address: form.value.email,
        email_type: this.defaultEmailType.id,
        id: this.defaultEmail.id
      });

    // Make non-default all the phone numbers currently present in the contact,
    // and set the value entered in the form field as the default one.
    let shouldSubmitPhone = form.value.phone && this.defaultPhoneType;
    let phones: object[] = _(this.content.phones)
      .reject(['number', form.value.phone])
      .map(item => {
        return {
          // reset the `default` flag only of the form value isn't empty
          'default': !shouldSubmitPhone && item['default'],
          number: item.number,
          phone_type: item.phone_type,
          id: item.id || null
        };
      }).value();
    if (shouldSubmitPhone)
      phones.push({
        'default': true,
        number: form.value.phone,
        phone_type: this.defaultPhoneType.id,
        id: this.defaultPhone.id
      });
    return Object.assign(new Contact(), this.content, {
      first_name: form.value.firstName,
      last_name: form.value.lastName,
      brands: [],
      contact_types: [],
      dates: dates,
      addresses: addresses,
      emails: emails,
      phones: phones,
      social_networks: []
    });
  }
}

@Injectable()
export class ContactsUiService {
  detailContent$: Observable<Contact>;
  masterContent$: Observable<ContactPageCursor>;
  contactTypes$: Observable<ContactType[]>;
  dateTypes$: Observable<DateType[]>;
  emailTypes$: Observable<EmailType[]>;
  jobRoles$: Observable<JobRole[]>;
  phoneTypes$: Observable<PhoneType[]>;

  private masterViewContent = new Subject<ContactPageCursor>();
  private detailViewContent = new BehaviorSubject<Contact>(Contact.Empty);
  private contactTypesSubject = new AsyncSubject<ContactType[]>();
  private dateTypesSubject = new AsyncSubject<DateType[]>();
  private emailTypesSubject = new BehaviorSubject<EmailType[]>([]);
  private jobRolesSubject = new BehaviorSubject<JobRole[]>([]);
  private phoneTypesSubject = new BehaviorSubject<PhoneType[]>([]);
  private isLoading: boolean = false;
  private contactFormContext: ContactFormContext = new ContactFormContext();

  
  constructor(private accessService: AccessService,
              private contactService: ContactService,
              private emailTypeService: EmailTypeService,
              // private flash: FlashMessageService,
              private jobRoleService: JobRoleService,
              private phoneTypeService: PhoneTypeService,
              // private modal: Modal
              ) {
    this.detailContent$ = this.detailViewContent.asObservable();
    this.masterContent$ = this.masterViewContent.asObservable();
    this.contactTypes$ = this.contactTypesSubject.asObservable();
    this.dateTypes$ = this.dateTypesSubject.asObservable();
    this.emailTypes$ = this.emailTypesSubject.asObservable();
    this.jobRoles$ = this.jobRolesSubject.asObservable();
    this.phoneTypes$ = this.phoneTypesSubject.asObservable();

    this.accessService.currentUser$
      .filter(_.identity)  // ignore the anonymous user
      .subscribe(() => this.resetData());
    this.jobRoleService.remoteDataHasChanged
      .subscribe(this.fetchJobRoles.bind(this));
    this.emailTypeService.remoteDataHasChanged
      .subscribe(this.fetchEmailTypes.bind(this));
    this.phoneTypeService.remoteDataHasChanged
      .subscribe(this.fetchPhoneTypes.bind(this));
  }

  static createContactBasicDetailsForm(): FormGroup {
    return new FormGroup({
      firstName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(200)
      ])),
      lastName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(200)
      ])),
      email: new FormControl('', Validators.compose([
        emailOrEmpty, Validators.maxLength(254)
      ])),
      phone: new FormControl(''),
      postalAddress: new FormControl('', Validators.maxLength(255)),
      birthday: new FormControl(''),
      anniversary: new FormControl(''),
      default_address: new FormControl(null)
    });
  }

  get detailContent(): Contact {
    return this.detailViewContent.value;
  }

  set detailContent(value: Contact) {
    this.detailViewContent.next(value);
  }

  createContactFormContext(contact$: Observable<object>): Observable<ContactFormContext> {
    return ContactFormContext.createForContact(
        contact$, this.contactTypes$, this.dateTypes$,
        this.emailTypes$, this.phoneTypes$);

    // return new Observable(observer => {
    //   this.contactFormContext.createForContact(
    //     contact$, this.contactTypes$, this.dateTypes$,
    //     this.emailTypes$, this.phoneTypes$).subscribe(
    //       value=> {
    //         observer.next(value);
    //         observer.complete();
    //       },
    //     err=>{
    //       console.log("error", err);
    //     },
    //     ()=>{

    //     }

    //     );
      
    // });
  }

  public displaySuccessMessage(message: string): void {
    // this.flash.success(message);
  }

  public displayErrorMessage(message: string): void {
    // this.flash.error(message);
  }

  public displayYesNoMessage(message: string): Observable<boolean> {
    let result = new Subject<boolean>();
    // this.alertify.confirm(message,
    //   () => {
    //     result.next(true);
    //   },
    //   () => {
    //     result.next(false);
    //   });
    return result;
  }

  // prepareContent() {}
  // newObject(): Contact

  fetch(params: any = {}): void {
    this.isLoading = true;
    this.contactService.getList(params)
      .map(response => {
        return Object.assign(new ContactPageCursor(), {
          count: response.count,
          results: _.map(response.results, ContactService.newObject)
        });
      })
      .subscribe(response => {
        this.isLoading = false;
        this.masterViewContent.next(response);
      });
  }

  // selectedObjects: Contact[]

  // selectObjectById(id: number, forceRemote?: boolean) {
  //   this.contactService.getContact(id)
  //     .subscribe((contactData: object) => {
  //       this.detailContent = this.contactService.newObject(contactData);
  //     });
  // }

  public displayAddOrUpdateDialog(value?: Contact): Observable<Contact> {
    let result = new Subject<Contact>();
    // if (this.contactDialog && !this.contactDialog.destroyed) {
    //   this.contactDialog.destroy();
    //   this.contactDialog = null;
    // }

    // let config = overlayConfigFactory({content: value}, ContactDialogContext);
    // this.modal.open(ContactDialogComponent, config)
    //   .then(dialog => {
    //     this.contactDialog = dialog;
    //     dialog.result.then(data => {
    //       result.next(data);
    //       result.complete();
    //     }, () => { result.complete(); });
    //   }, () => { result.complete(); });
    return result;
  }

  public createLead() {}

  public archiveContacts(contacts: Contact[]) {
  }

  public disableContacts(contacts: Contact[]) {
  }

  public enableContacts(contacts: Contact[]) {
  }

  public exportContacts(contacts: Contact[] /*, format?: ExportContactFormat*/) {
  }

  // TODO: selection management

  // TODO: search and sorting management

  // TODO: pagination management

  private resetData() {
    this.contactService.getRequestContactTypes()
      .map(results => _.map(results, item => Object.assign(new ContactType(), item)))
      .subscribe(this.contactTypesSubject);
    this.contactService.getDateTypes().subscribe(this.dateTypesSubject);
    this.fetchEmailTypes();
    this.fetchJobRoles();
    this.fetchPhoneTypes();
  }

  private fetchEmailTypes() {
    this.emailTypeService.getList()
      .map(response => _.map(response.results, EmailTypeService.newObject))
      .subscribe(value => this.emailTypesSubject.next(value));
  }

  private fetchJobRoles() {
    this.jobRoleService.getList()
      .map(response => _.map(response.results, JobRoleService.newObject))
      .subscribe(value => this.jobRolesSubject.next(value));
  }

  private fetchPhoneTypes() {
    this.phoneTypeService.getList()
      .map(response => _.map(response.results, PhoneTypeService.newObject))
      .subscribe(value => this.phoneTypesSubject.next(value));
  }
}
