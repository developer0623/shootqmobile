import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { ProfileImg } from './profile-img';
import { ContactImg } from './contact-img';
import { AddContactItem } from "./add-contact-item";

@NgModule({
    declarations: [
        ProfileImg,
        ContactImg,
        AddContactItem
    ],
    imports: [IonicModule],
    exports: [ProfileImg, ContactImg, AddContactItem],
    entryComponents: [ProfileImg, ContactImg, AddContactItem]
})
export class NgProfileImgModule {
}
