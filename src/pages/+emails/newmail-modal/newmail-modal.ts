import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams} from 'ionic-angular';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Contact } from '../../../models/contact';

import { ApiService } from '../../../services/api';
import { SentCorrespondenceService } from "../../../services/sent-correspondence";
import { GeneralFunctionsService } from '../../../services/general-functions/general-functions.service';
import { MessageFormContext } from './message-form';
import { MessagingUiService } from './messaging-ui.service';

import { EmailTemplate } from '../../../models/email-template.model';
import { Message, MessageAttachment } from '../../../models/sentcorrespondence';

const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;


function isValidEmail(value) {
  return _.isString(value) && EMAIL_REGEXP.test(value);
}

@Component({
  selector: 'newmail-modal',
  templateUrl: 'newmail-modal.html'
})
export class NewMailModal implements OnInit{
  public form: FormGroup;
  private isLoading: boolean = false;
  private messageFormData: MessageFormContext;
  //noinspection JSMismatchedCollectionQueryUpdate
  private templates: EmailTemplate[] = [];
  private selectedTemplate: EmailTemplate = null;
  private selectedTemplateName: string = '';


  public jobId: any;
  public jobName: string = '';
  public mainContact: Contact;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController,
   private fb: FormBuilder, private navParams: NavParams,
    @Inject(forwardRef(() => MessagingUiService)) private presenter: MessagingUiService,
      private generalFunctions: GeneralFunctionsService,
      private apiService: ApiService) {


    this.jobId = this.navParams.get("jobid");
    this.jobName = this.navParams.get("jobName");
    this.mainContact = this.navParams.get("mainContact");
    console.log("jobName", this.jobName);

    this.form = this.createForm();
    console.log("form", this.form);

    
    // setTimeout(() => this.setViewValue(this.context.content));
  }

  ngOnInit(): void {
    this.makeMessage();
  }

  makeMessage(){
    
    let message = SentCorrespondenceService.newObject({
      subject: this.jobName,
      job: this.jobId,
      recipients: [this.mainContact.id]
    });

    this.setViewValue(message);
  }

  //  get message(): Message {
  //   return this.context.content;
  // }

  createForm(): FormGroup {
    return this.fb.group({
      subject: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(128)
      ])),
      body: new FormControl('', Validators.required),
      recipients: new FormControl([], Validators.required),
      ccRecipients: new FormControl([]),
      bccRecipients: new FormControl([]),
    });
  }

  setViewValue(content: Message) {
    // create the form data for the message and update the form with that data
    this.messageFormData = MessageFormContext.createForMessage(content);
    this.messageFormData.applyToForm(this.form);
    // reset the attachments
    // this.files.length = 0;
    // _.each(content.files_data, this.addFile.bind(this));
    // After the form context is created we can reset its dictionaries
    // whenever the data is arrived.
    this.presenter.addressBook$.subscribe(this.resetContacts.bind(this));
    this.presenter.event$.subscribe(() => this.resetTemplates(this.presenter.templates));
    this.presenter.templates$.subscribe(this.resetTemplates.bind(this));
  }

  getSubmitValue(): Message {
    let result = this.messageFormData.getFormSubmitValue(this.form);
    // result.files = _.map(this.files, 'id');
    return result;
  }

  private resetContacts(contacts: Contact[]): void {
    this.messageFormData.addressBook = contacts.slice();
    this.messageFormData.applyToForm(this.form);
  }

  private resetTemplates(templates: EmailTemplate[]): void {
    this.templates = templates.slice();
    // this.templatesEnable = this.templates.length > 0;
  }

  //noinspection JSUnusedLocalSymbols
  private createSuggestContactsCallback() {
    let self = this;
    return suggestContacts;

    // See the [`tag-input` documentation](http://bit.ly/2s9kjAY) for details.
    function suggestContacts(text: string) {
      let searchText = text.toLocaleLowerCase();
      return self.presenter.addressBook$
        .map(contacts => {
          return _.chain(contacts)
            // list contacts with the default email and the contact name
            // containing th search text
            .filter(item => {
              return _.isNumber(item.default_email) &&
                item.fullName.toLocaleLowerCase().indexOf(searchText) >= 0;
            })
            // convert them to the format suitable to display on the `tag-input`
            .map(item => {
              return {value: item.id, display: item.fullName, email: item.defaultEmail};
            })
            .value();
        });
    }
  }

  //noinspection JSUnusedLocalSymbols
  private createOnAddingCallback() {
    let self = this;
    return onAdding;

    function onAdding(tag): Observable<any> {
      if (_.isObject(tag) && _.isNumber(tag['value']) || isValidEmail(tag))
        // Unfortunately the tag input ignores `value` property of the returned
        // object, so we cannot substitute the email to an existing contact.
        return Observable.of(tag);
      // Do not allow to add the tag if it's neither a valid email nor a contact
      return Observable.empty();
    }
  }

  onSend(){
    console.log("newmessage", this.getSubmitValue());
  }

  

  
  
}
