import { Injectable } from '@angular/core';
import { ToastController } from "ionic-angular";



@Injectable()
export class ConstData {
	public apiAddress = 'http://shootq-base.test.gearheart.io';
	public loginUrl = this.apiAddress+'/o/token/';
	public clinet_id = '3iz2kduB3pVuA0hbWNd04Jss2dAhxnORTgHYaJMb';
	public client_secret = 'd5QTixcKKk3vig8pnotaTAvtPSArNbhrYC2EeT2JLU9Wm9cnPdtsv8BgRGoGIwVd8OirIYlmeaOBgDie0vbrWb1WnrhqN4eFzonAGF2miMRUyw7UNqANQ4PjU0wMwzm6';
	public grant_type = 'password';
  

  private userphoto: string= '';

  constructor(private toastCtrl: ToastController) {

  }

  setUserPhoto(url){
    this.userphoto = url;

  }
  getUserphoto(){
    return this.userphoto;
  }

  makingToast(title, time, position){
    let toast = this.toastCtrl.create({
      message: title,
      duration: time,
      position: position
    });
    toast.present();

  }

  //storage.set('name', 'max');
  //storage.get('age').then((val) => {
  //  console.log('your age is', val);
  // });
  
}


export const statusDraft = 'draft';
export const statusArchived = 'archived';
export const statusDeleted = 'deleted';
